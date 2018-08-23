require('./upgradeLib')("FILENAME", function(){

    if (process.env.ETH_NETWORK !== "stopgap") {
        console.log("Skipping as not stopgap network")
        return
    }

    console.log("Updating eth-stats config")

    let port = 38545
    editParityConfig(c => {
        port = c['rpc']['port']
    })

    const ethStatsDir = "/home/ubuntu/eth-stats"
    const configFilename = "app.json"
    const configPath = `${ethStatsDir}/${configFilename}`

    editJsonFile(configPath, config => {
        config[0].env.RPC_PORT = port.toString()
    })

    execCmd("bash -i -c 'pm2 delete eth-sv-stats && exit'")
    execCmd(`bash -i -c 'cd /home/ubuntu/eth-stats/ && pm2 start ${configFilename} && pm2 save && exit'`)

});
