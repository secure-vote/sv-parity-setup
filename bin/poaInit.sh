#!/bin/bash

. ~/.nvm/nvm.sh

read -p "POA Validator Address > " ADDR
read -s -p "POA Validator Secret Key > " SECRET_KEY

# just for this script
export ADDR
export SECRET_KEY

# gen and set password
< /dev/urandom LC_CTYPE=C tr -c -d _A-Z-a-z-0-9 | head -c20 > /mnt/eth/password.txt
PASSWORD="$(cat /mnt/eth/password.txt)"
echo "Created password"

sudo systemctl stop parity
sleep 5s
node ~/bin/_poaStep1.js
sudo systemctl start parity
sleep 10s

curl --data "{\"jsonrpc\":\"2.0\",\"method\":\"parity_newAccountFromSecret\",\"params\":[\"0x$SECRET_KEY\", \"$PASSWORD\"],\"id\":0}" -H "Content-Type: application/json" -X POST 127.0.0.1:8545

sudo systemctl stop parity
sleep 5s
node ~/bin/_poaStep2.js
sudo systemctl start parity

echo "Done. No need to run _poaStep1.js, etc, as I already have."
