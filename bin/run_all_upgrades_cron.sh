#!/bin/bash

SLEEP_FOR=$(expr $RANDOM / 10)
echo "Sleeping for $SLEEP_FOR seconds"
date
sleep $SLEEP_FOR
echo "Proceeding with upgrades"
date

cd ~/sv-parity-setup
git pull
./bin/run_all_upgrades.sh
