require('./upgradeLib')("FILENAME", function(){

    if (process.env.ETH_NETWORK !== "stopgap") {
        console.log("Skipping as not stopgap network")
        return
    }

    console.log("Setting new chainspec path")

    editParityConfig(c => {
        if (c['parity']['chain'] == "/home/ubuntu/sv-parity-setup/stopgap-spec.json")
            c['parity']['chain'] = "/home/ubuntu/sv-parity-setup/sv-poa-spec.json"
        else
            console.log("Path to chainspec incorrect, skipping")
    })

    restartParity()

});
