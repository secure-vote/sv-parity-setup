#!/bin/bash

source ~/bin/_loadCommon.sh

read -p "What is this nodes external IP address? > " EXTIP

echo "Configuring for IP $EXTIP"

cd ~/bin/
node _setNatExtIP.js "$EXTIP"

sudo systemctl restart parity
