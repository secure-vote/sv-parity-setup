#!/bin/bash

SLEEP_FOR=$(expr $RANDOM / 30)
echo "Sleeping for $SLEEP_FOR seconds"
date | tee ~/.sv-cron-run-all-upgrades-last
sleep $SLEEP_FOR
echo "Proceeding with upgrades"
date

cd ~/sv-parity-setup
git pull
./bin/run_all_upgrades.sh | tee -a ~/.sv-cron-run-all-upgrades-last
