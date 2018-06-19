require('./upgradeLib')("FILENAME", function(){

    editParityConfig(c => {
        c['websockets']['interface'] = "all"
    })
    restartParity()

});
