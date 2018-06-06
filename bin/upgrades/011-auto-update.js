require('./upgradeLib')("011-auto-update", function(){

    editParityConfig(c => {
        c['parity']['auto_update'] = "all" 
        // this is in the parity config generator but apparently doesn't exist!
        // c['parity']['auto_update_delay'] = 2000
        c['parity']['release_track'] = "beta"
    })
    execCmd("systemctl restart parity")

});
