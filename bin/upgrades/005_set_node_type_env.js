require('./upgradeLib')("005-set-node-type-env", function(){

    let node = 'parity'
    if(fs.existsSync('/usr/bin/geth')){
        node = 'geth'
    }
    execCmd(`echo 'export ETH_NODE_TYPE=${node}' >> ~/.bashrc`)

});
