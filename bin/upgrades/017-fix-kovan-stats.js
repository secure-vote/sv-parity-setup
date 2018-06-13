require('./upgradeLib')("FILENAME", function(){

    const ethStatsDir = "/home/ubuntu/eth-stats"
    const configFilename = "app-parity-stats.json"
    const configPath = `${ethStatsDir}/${configFilename}`

    editJsonFile(configPath, config => {
        const s = config[0].env.WS_SERVER
        if (s === "wss://stats-kovan.parity.io") {
            config[0].env.WS_SERVER = `wss://kovan-stats.parity.io`
        }
    })

    execCmd("bash -i -c 'pm2 delete stats-parity && exit'")
    execCmd(`bash -i -c 'cd /home/ubuntu/eth-stats/ && pm2 start ${configFilename} && pm2 save && exit'`)
});
