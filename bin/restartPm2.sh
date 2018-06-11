#!/bin/bash

. ~/bin/_loadCommon.sh

pm2 restart eth-sv-stats
pm2 restart eth-sv-stats-parity
