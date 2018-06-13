#!/bin/bash

# $RANDOM generates an int in [0, 32767]
# dividing by 30 gives us a range of seconds in [0, 1092]
# which corresponds to a range in minutes of [0, 18.2]
# so we can theoretically run this script from cron a max of every 20min atm
SLEEP_FOR=$(expr $RANDOM / 30)
echo "Sleeping for $SLEEP_FOR seconds"
date | tee ~/.sv-cron-run-all-upgrades-last
sleep $SLEEP_FOR
echo "Proceeding with upgrades"
date

cd ~/sv-parity-setup
git pull
./bin/run_all_upgrades.sh | tee -a ~/.sv-cron-run-all-upgrades-last
