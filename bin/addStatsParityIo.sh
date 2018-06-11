#!/bin/bash

. ~/bin/_loadCommon.sh

cd ~/eth-stats

pm2 start app-parity-stats.json
pm2 save
