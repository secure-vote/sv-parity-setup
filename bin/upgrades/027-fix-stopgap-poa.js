require('./upgradeLib')("FILENAME", function(){

    if (process.env.ETH_NETWORK !== "stopgap") {
        console.log("Skipping as not stopgap network")
        return
    }

    console.log("Setting mining params for poa nodes")

    editParityConfig(c => {
        c['mining'] = c['mining'] || {}
        c['mining']['force_sealing'] = true
        c['mining']['gas_floor_target'] = "10000000"
        c['mining']['min_gas_price'] = 1
    })

    restartParity()

});
