#!/bin/bash

source ~/.bashrc

npm i -g pm2
eval "$(pm2 startup | tail -n 1)"

cd ~
git clone https://github.com/cubedro/eth-net-intelligence-api eth-stats
cd eth-stats
npm i

cp ~/bin/alterStatsConfig.js ./
node alterStatsConfig.js

pm2 start app.json
pm2 save
