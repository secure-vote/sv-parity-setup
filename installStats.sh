#!/bin/bash

npm i -g pm2
$(pm2 startup | tail -n 1)

cd ~
git clone https://github.com/cubedro/eth-net-intelligence-api eth-stats
cd eth-stats

cp ~/bin/alterStatsConfig.js ./
node alterStatsConfig.js

pm2 start app.json
pm2 save
