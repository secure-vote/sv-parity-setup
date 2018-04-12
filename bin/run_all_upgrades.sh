#!/bin/bash

set -x

cd ~
echo "Pulling newest version from git."

if [ ! -d ~/sv-parity-setup ]; then
    git clone https://github.com/secure-vote/sv-parity-setup ~/sv-parity-setup
fi

cd ~/sv-parity-setup
git pull
./installBin.sh
cd ~

cd ~/bin/upgrades

set +x  # no need to echo nvm or beyond here
source ~/bin/_loadCommon.sh

echo "Running all files in $(pwd)"
for f in `ls`; do
    echo "-------------------"
    echo "Running upgrade: $f"
    echo ""
    sudo -E node "./$f"
    echo ""
    echo "Completed $f"
done
