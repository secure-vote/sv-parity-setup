#!/bin/bash

set -e

. ~/.nvm/nvm.sh
. ~/.profile
. ~/.bashrc
export NODE_PATH=`npm root -g`
nvm use default
