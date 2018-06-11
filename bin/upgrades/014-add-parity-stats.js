require('./upgradeLib')("014-add-parity-stats", function(){

    const ethStatsDir = "/home/ubuntu/eth-stats"
    const newAppFilename = "app-parity-stats.json"
    const newAppPath = `${ethStatsDir}/${newAppFilename}`
    fs.copyFileSync(`${ethStatsDir}/app.json`, newAppPath)

    editJsonFile(newAppPath, config => {
        config[0].name = "eth-sv-stats-parity"

        const net = process.env.ETH_NETWORK == "mainnet" ? "" : "-" + process.env.ETH_NETWORK;
        config[0].env.WS_SERVER = `wss://stats${net}.parity.io`
        config[0].env.WS_SECRET = 'REPLACE_ME'
    })

    execCmd(`chown ubuntu:ubuntu ${newAppPath}`)
    execCmd(`sudo -u ubuntu /home/ubuntu/bin/addStatsParityIo.sh`)
    execCmd(`/home/ubuntu/bin/restartPm2.sh`)
});
