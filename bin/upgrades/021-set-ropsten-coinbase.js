require('./upgradeLib')("FILENAME", function(){

    var finishUp = async () => {}

    editParityConfig(c => {
        if (c['parity'] && c['parity']['chain'] && c['parity']['chain'] === "ropsten") {
            c['mining'] = c['mining'] || {}
            c['mining']['author'] = "0xc45797d1A7acCc9FB2DcB054Aa907f303A0a08f8"
            c['mining']['tx_queue_size'] = 10000
            c['mining']['gas_floor_target'] = "90000000"

            finishUp = async () => { restartParity() }
        }
    })

    finishUp()

});
