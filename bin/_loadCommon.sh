#!/bin/bash

set -e

. ~/.nvm/nvm.sh
. ~/.profile
. ~/.bashrc
export NODE_PATH=`npm root -g`
nvm use default

# a bit hacky...
sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/node" "/usr/local/bin/node"
sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/npm" "/usr/local/bin/npm"
