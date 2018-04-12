#!/bin/bash

cd ~
echo "Pulling newest version from git."

if [ -d ~/sv-parity-setup ]; then
    git clone https://github.com/secure-vote/sv-parity-setup ~/sv-parity-setup
fi

cd ~/sv-parity-setup
git pull
./installBin.sh
cd ~

cd ~/bin/upgrades

. ~/.nvm/nvm.sh

for f in $(ls .); do
    echo "-------------------"
    echo "Running upgrade: $f"
    sudo node "./$f"
    echo "Completed $f"
done
