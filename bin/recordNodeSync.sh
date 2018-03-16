#!/bin/bash

. ~/.nvm/nvm.sh

LOGFILE="~/.logParityProgress"

echo "------" >> $LOGFILE
date +%s >> $LOGFILE
date >> $LOGFILE
NODE_PATH=`npm root -g` node ~/bin/getParityBlock.js >> $LOGFILE
