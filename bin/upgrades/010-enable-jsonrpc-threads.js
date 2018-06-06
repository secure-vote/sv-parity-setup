require('./upgradeLib')("010-enable-jsonrpc-threads", function(){

    editParityConfig(c => {
        c['rpc']['server_threads'] = 3
        c['rpc']['processing_threads'] = 5
    })
    execCmd("systemctl restart parity")

});
