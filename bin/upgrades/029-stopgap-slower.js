require('./upgradeLib')("FILENAME", function(){

    if (process.env.ETH_NETWORK !== "stopgap") {
        console.log("Skipping as not stopgap network")
        return
    }

    console.log("Setting better block time params for POA nodes")

    editParityConfig(c => {
        c['mining'] = c['mining'] || {}
        // these will disable force sealing every 4s but will still mandate blocks are produced at least every 30s
        c['mining']['force_sealing'] = false
        c['mining']['reseal_max_period'] = 30000
    })

    restartParity()

});
