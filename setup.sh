#!/bin/bash
set -x -e

# grab dat dere node name
NODE_NAME=$1

# this prevents pip3 complaining
export LC_ALL=C

# general ubuntu stuff + packages
sudo apt-get update 
sudo apt-get -y upgrade
sudo DEBIAN_FRONTEND=noninteractive apt-get -y install htop sysstat python-minimal python3 python3-pip build-essential zsh


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
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab


# setup parity directories + nvme
mkdir -p ~/.local/share
sudo mkdir -p /mnt/eth
echo "/dev/nvme0n1 /mnt/eth ext4 defaults,discard 0 0" | sudo tee -a /etc/fstab
sudo mkfs.ext4 /dev/nvme0n1
sudo tune2fs -m 2 /dev/nvme0n1
sudo mount -a
sudo chown -R ubuntu:ubuntu /mnt/eth
ln -s /mnt/eth ~/.local/share/io.parity.ethereum

python3 setParityConfig.py --name "$NODE_NAME"


# set hostname stuff for server
echo "$NODE_NAME" | sudo tee /etc/hostname
echo "127.0.1.1 $NODE_NAME" | sudo tee -a /etc/hosts

# echo 'export PATH=~/bin/:$PATH' | tee -a ~/.zshrc
echo 'export PATH=~/bin/:$PATH' | tee -a ~/.bashrc
echo 'export NODE_PATH=~/.nvm/versions/node/v8.10.0/' | tee -a ~/.bashrc
mkdir -p ~/bin
cp -a ./bin/* ~/bin/

# sudo chsh ubuntu -s /bin/zsh

sudo cp check_parity_cronjob /etc/cron.d/

./installServices.sh

# finish up by rebooting
sudo shutdown -r now
