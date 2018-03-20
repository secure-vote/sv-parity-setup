#!/bin/bash
set -x -e

# grab dat dere node name
echo "Please enter a name for this node! (e.g. eth-aws-nv-node-05)" && \
read -p "> " NODE_NAME

echo "Choose network:"
options=("mainnet" "kovan" "classic" "ropsten")
select NETWORK in "${options[@]}"
do
	case $NETWORK in
		"mainnet"|"kovan"|"classic"|"ropsten")
			echo "Selected: $NETWORK"
			break
			;;
		*)
			echo "Invalid selection...";;
	esac
done
		


# this prevents pip3 complaining
export LC_ALL=C


function add_line_to_file {
	if [ $# -ne 2 ]; then 
		echo "ERROR; WRONG NUMBER OF ARGS add_line_to_file"
		false
	else
		grep -qF "$1" "$2" || echo "$1" | sudo tee -a "$2"
	fi
}


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
sudo dpkg -i ~/parity.deb
rm -f ~/parity.deb


# get some swap up in here
sudo fallocate -l 2G /swapfile || true
sudo chmod 600 /swapfile
sudo mkswap /swapfile || true
sudo swapon /swapfile || true
sudo sysctl vm.swappiness=10 || true

add_line_to_file 'vm.swappiness=10' '/etc/sysctl.conf'
add_line_to_file '/swapfile none swap sw 0 0' '/etc/fstab'

# setup parity directories + nvme
mkdir -p ~/.local/share
sudo mkdir -p /mnt/eth
add_line_to_file "/dev/nvme0n1 /mnt/eth ext4 defaults,discard 0 0" "/etc/fstab"
sudo mkfs.ext4 /dev/nvme0n1 || true
sudo tune2fs -m 2 /dev/nvme0n1 || true
sudo mount -a
sudo chown -R ubuntu:ubuntu /mnt/eth
ln -s /mnt/eth ~/.local/share/io.parity.ethereum

python3 setParityConfig.py --name "$NODE_NAME" --net "$NETWORK"


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

cd ../
git clone https://github.com/secure-vote/sv-parity-setup && rm -rf ./sv-parity-setup-master || true

# finish up by rebooting
sudo shutdown -r now
