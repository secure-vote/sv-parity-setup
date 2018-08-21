require('./upgradeLib')("FILENAME", function(){

    installPackage("software-properties-common")
    execCmd("add-apt-repository -y ppa:ethereum/ethereum", true)
    execCmd('apt-get update', true)
    installPackage('ethereum')

});
