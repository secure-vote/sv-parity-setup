#!/bin/bash

. ~/.nvm/nvm.sh

LOGFILE="/home/ubuntu/.logParityProgress"

touch $LOGFILE
echo "------" >> $LOGFILE
date +%s >> $LOGFILE
date >> $LOGFILE
NODE_PATH=`npm root -g` node ~/bin/getParityBlock.js >> $LOGFILE
