#!/bin/bash

. ~/bin/_loadCommon.sh

# sleep up to an hour or so
sleep $(expr $RANDOM / 10)

pm2 restart eth-sv-stats
