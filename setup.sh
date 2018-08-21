#!/bin/bash
set -x -e

echo -e "\n\nSTARTING SETUP AT $(date +%s)\n\n"

NODE_NAME="$1"
NETWORK="$2"


# this prevents pip3 complaining
export LC_ALL=C


confirm() {
    # call with a prompt string or use a default
    read -r -p "${1:-Are you sure? [y/N]} " response
    case "$response" in
        [yY][eE][sS]|[yY])
            return 0  # good return
            ;;
        *)
            return 1  # bad return
            ;;
    esac
}

function add_line_to_file {
	if [ $# -ne 2 ]; then
		echo "ERROR; WRONG NUMBER OF ARGS add_line_to_file"
		false
	else
		grep -qF "$1" "$2" || echo "$1" | sudo tee -a "$2"
	fi
}

contains() {
        typeset _x;
        typeset -n _A="$1"
        for _x in "${_A[@]}" ; do
                [ "$_x" = "$2" ] && return 0
        done
        return 1
}

function setup_storage {
	echo "Partitioning $1"
	add_line_to_file "$1 /mnt/eth ext4 defaults,discard 0 0" "/etc/fstab"
	sudo mkfs.ext4 "$1" || true
	sudo tune2fs -m 2 "$1" || true
	sudo mount -a
	echo "Finished partitioning $1"
}





if [[ -z "$NODE_NAME" ]]; then
	# grab dat dere node name
	echo "Please enter a name for this node! (e.g. eth-aws-nv-node-05)" && \
	read -p "> " NODE_NAME
else
	echo "Using '$NODE_NAME' for NODE_NAME"
fi


options=("mainnet" "kovan" "classic" "ropsten" "stopgap")


if [[ -z "$NETWORK" ]]; then
	echo "Choose network:"
	select NETWORK in "${options[@]}"
	do
		case $NETWORK in
			"mainnet"|"kovan"|"classic"|"ropsten"|"stopgap")
				echo "Selected: $NETWORK"
				break
				;;
			*)
				echo "Invalid selection...";;
		esac
	done
else
	if contains options "$NETWORK" ; then
		echo "Setting up node on $NETWORK"
	else
		echo "Network named $NETWORK is unknown. Exiting..."
		exit 1
	fi
fi


echo "export ETH_NETWORK=$NETWORK" >> ~/.bashrc
echo "export NODE_NAME=$NODE_NAME" >> ~/.bashrc


export ETH_NETWORK=$NETWORK
export NODE_NAME=$NODE_NAME



# setup parity directories + nvme
mkdir -p ~/.local/share
sudo mkdir -p /mnt/eth

if confirm "Would you like to partition extra disk? [y/N]" ; then
	drive=false
	if [ -e /dev/nvme0n1 ]; then
		drive="/dev/nvme0n1"
	elif [ -e /dev/xvdb ]; then
		drive="/dev/xvdb"
	else
		echo "No extra disk found. Not partitioning."
	fi

	if test "$drive" != "false" && confirm "Okay to partition $drive [y/N]" ; then
		setup_storage "$drive"
	else
		echo "Not doing any partitioning."
	fi
fi

sudo chown -R ubuntu:ubuntu /mnt/eth
ln -s /mnt/eth ~/.local/share/io.parity.ethereum || true

echo "Please enter total RAM in MB" && \
read -p "> " TOTAL_RAM
echo "Configuring for $TOTAL_RAM MB of RAM"


pruning=""
confirm "Should this node be a full archive node? [y/N]" && echo "Node being configured as full archive" && pruning="--archive" || echo "Node will not be a full archive node."


echo "I'll now set up the node with the given details." && confirm "Continue? [y/N]" || ( echo "exiting" && exit 1 )


# hold grub version so we don't get prompted for user input
sudo apt-mark hold grub


# general ubuntu stuff + packages
sudo apt-get update
## found at https://askubuntu.com/questions/146921/how-do-i-apt-get-y-dist-upgrade-without-a-grub-config-prompt
sudo DEBIAN_FRONTEND=noninteractive apt-get -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" dist-upgrade
sudo apt-get -y install htop sysstat python-minimal python3 python3-pip \
	build-essential zsh git-core fail2ban


# node stuff
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" > /dev/null # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" > /dev/null # This loads nvm bash_completion
nvm install 8.10.0
npm install -g web3@1.0.0-beta.31 toml-js


# python requirements + download parity
pip3 install requests toml
python3 getParity.py

# install parity + cleanup
sudo mv ~/parity.bin /usr/bin/parity
sudo chown root:root /usr/bin/parity
sudo chmod 555 /usr/bin/parity


# get some swap up in here
sudo fallocate -l 2G /swapfile || true
sudo chmod 600 /swapfile
sudo mkswap /swapfile || true
sudo swapon /swapfile || true
sudo sysctl vm.swappiness=10 || true

add_line_to_file 'vm.swappiness=10' '/etc/sysctl.conf'
add_line_to_file '/swapfile none swap sw 0 0' '/etc/fstab'


python3 setParityConfig.py --name "$NODE_NAME" --net "$NETWORK" --ram "$TOTAL_RAM" $pruning


# set hostname stuff for server
echo "$NODE_NAME" | sudo tee /etc/hostname
add_line_to_file "127.0.1.1 $NODE_NAME" "/etc/hosts"

# echo 'export PATH=~/bin/:$PATH' | tee -a ~/.zshrc
add_line_to_file 'export PATH=~/bin/:$PATH' ~/.bashrc
add_line_to_file 'export NODE_PATH=~/.nvm/versions/node/v8.10.0/' ~/.bashrc

# don't add cronjob, turns out might be useless
# sudo cp check_parity_cronjob /etc/cron.d/

./installCron.sh
./installBin.sh
./installServices.sh
./installStats.sh
# this script clones repo to ~/sv-parity-setup
./bin/run_all_upgrades.sh

cd ~
rm -rf ./sv-parity-setup-master || true

# finish up by rebooting
sudo shutdown -r now
