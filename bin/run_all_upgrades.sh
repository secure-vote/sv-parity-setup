#!/bin/bash

set -x
set -e

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

node -v

mkdir -p ~/.sv-upgrades/logs

LOGDIR="$HOME/.sv-upgrades/logs"

echo "Running all files in $(pwd)"
UPGRADEFILES=`ls | grep '\.js' | grep -v upgradeLib`
echo "Upgrade files to run:"
echo "$UPGRADEFILES"
echo ""
for f in "$UPGRADEFILES"; do
    echo "------------------- ($(date +%s))" | tee -a "$LOGDIR/$f.log"
    echo "Running upgrade: $f" | tee -a "$LOGDIR/$f.log"
    sudo -E node "./$f" | tee -a "$LOGDIR/$f.log"
    echo "Completed $f" | tee -a "$LOGDIR/$f.log"
done
echo "-------------------"
