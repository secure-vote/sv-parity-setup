#!/bin/bash

if [ -z "$1" ]; then
  echo "Need to provide node name as first arg!"
  exit 1
fi

echo "Setting node type to $1"

echo "Continue?"
select res in Yes No
do 
  if [ "$res" = No ]; then echo 'exiting..'; exit; else break; fi
done

echo 'proceeding'

echo "export ETH_NETWORK=$1" >> ~/.bashrc
echo "export NODE_NAME=$(cat /etc/hostname)" >> ~/.bashrc

export ETH_NETWORK=$1
export NODE_NAME=$(cat /etc/hostname)

sed -i 's/"eth", "rpc"/"eth", "net", "rpc"/' ~/.local/share/io.parity.ethereum/config.toml

sudo systemctl restart parity

echo 'installing stats...'

./installBin.sh
./installStats.sh

