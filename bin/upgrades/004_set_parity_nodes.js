require('./upgradeLib')("004-set-parity-peers", function(){

    editParityConfig(c => {
        c['network']['min_peers'] = 50
        c['network']['max_peers'] = 500
    })
    execCmd("systemctl restart parity")

});
