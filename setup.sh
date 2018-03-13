#!/usr/bin/env bash
set -x -e

# grab dat dere node name
NODE_NAME=$1

# this prevents pip3 complaining
export LC_ALL=C

# general ubuntu stuff + packages
sudo apt-get update 
sudo apt-get -y upgrade
sudo DEBIAN_FRONTEND=noninteractive apt-get -y install htop sysstat python3 python3-pip build-essential zsh
sudo chsh ubuntu -s /bin/zsh


# node stuff
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
source ~/.bashrc
nvm install node
npm install -g web3 nginx-conf


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


# set up service
sudo cp parity.service /etc/systemd/system/
sudo systemctl enable parity


# set hostname stuff for server
echo "$NODE_NAME" | sudo tee /etc/hostname
echo "127.0.1.1 $NODE_NAME" | sudo tee -a /etc/hosts

echo "export PATH=~/bin/:$PATH" | tee -a ~/.zshrc
echo "export PATH=~/bin/:$PATH" | tee -a ~/.bashrc
mkdir -p ~/bin
cp -a ./bin/* ~/bin/


# finish up by rebooting
sudo shutdown -r now
