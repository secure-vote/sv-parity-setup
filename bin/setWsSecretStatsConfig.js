#!/usr/bin/env node

const fs = require('fs');

let filename;
let secret;
let name
for (var i = 0; i < process.argv.length; i++){
    let arg = process.argv[i];
    if (arg.includes('=')) {
        let [key, value] = arg.split('=', 2)
        switch (key) {
            case "filename":
                filename = value
                break
            case "secret":
                secret = value
                break
            case "name":
                name = value
                break
        }
    }
}

if (filename === undefined || secret === undefined || name === undefined) {
    console.log(`Usage:
    node ./setWsSecretStatsConfig.js filename=/home/ubuntu/eth-stats/someApp.json secret=yourSecretHere "name=My Node Name"

    filename must be the full path

    Note: if an '=' char is the the value part of either filename or secret things will break!`)
    process.exit(1)
}

const config = JSON.parse(fs.readFileSync(filename));

config[0].env.WS_SECRET = secret
if (config[0].env.WS_SERVER == "wss://stats-undefined.parity.io") {
    config[0].env.WS_SERVER = "wss://stats.parity.io"
}
config[0].env.INSTANCE_NAME = name

fs.writeFileSync(filename, JSON.stringify(config, null, 4));
