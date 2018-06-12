require('./upgradeLib')("FILENAME", function(){

    const ethStatsDir = "/home/ubuntu/eth-stats"
    const newAppFilename = "app-parity-stats.json"
    const newAppPath = `${ethStatsDir}/${newAppFilename}`

    let chain = "mainnet"

    editParityConfig(c => {
        if ('chain' in c['parity']) {
            chain = c['parity']['chain']
        }
    })

    if (chain == "foundation")
        chain = "mainnet"

    execCmd("bash -i -c 'pm2 delete eth-sv-stats-parity && exit'")

    editJsonFile(newAppPath, config => {
        config[0].name = "stats-parity"
        const net = chain == "mainnet" ? "" : "-" + process.env.ETH_NETWORK;
        config[0].env.WS_SERVER = `wss://stats${net}.parity.io`
    })

    execCmd(`bash -i -c 'cd /home/ubuntu/eth-stats && pm2 start ${newAppFilename} && pm2 save && exit'`)

    fs.copyFileSync(`/home/ubuntu/sv-parity-setup/cron_sv`, '/etc/cron.d/sv')
});
