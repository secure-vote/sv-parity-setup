require('./upgradeLib')("012-disable-unused", function(){

    editParityConfig(c => {
        c['dapps']['disable'] = true
        c['secretstore']['disable'] = true
        c['ui']['disable'] = true
        c['footprint']['cache_size'] = 16384
        c['rpc']['server_threads'] = 15
        c['rpc']['processing_threads'] = 15
        c['mining']['tx_queue_size'] = 42949672
        c['parity']['no_persistent_txqueue'] = true
    })
    restartParity()

});
