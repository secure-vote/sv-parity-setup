require('./upgradeLib')("009-set-websockets-true", function(){

    editParityConfig(c => {
        c['websockets'] = c['websockets'] || {}
        c['websockets']['disable'] = false
        c['websockets']['port'] = 8546
        c['websockets']['interface'] = "local"
        c['websockets']['origins'] = ["*"]
        c['websockets']['apis'] = ["web3", "eth", "net", "rpc"]
        c['websockets']['hosts'] = ["*"]
    })
    execCmd("systemctl restart parity")

});
