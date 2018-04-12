#!/bin/bash

if [ -z "$1" ]; then
  echo "Need to provide node name as first arg!"
  exit 1
fi

echo "Setting node type to $1"

echo "Continue?"
select res in Yes No
do
  if [ "$res" = "No" ]; then exit; else break; fi
done

echo "Proceeding..."

echo "export ETH_NETWORK=$1" >> ~/.bashrc
echo "export NODE_NAME=$(cat /etc/hostname)" >> ~/.bashrc

sed -i 's/"eth", "rpc"/"eth", "net", "rpc"/' ~/.local/share/io.parity.ethereum/config.toml

