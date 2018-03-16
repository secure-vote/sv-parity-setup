#!/bin/bash

. ~/.nvm/nvm.sh
NODE_PATH=`npm root -g` node `dirname $0`/healthCheck.js
