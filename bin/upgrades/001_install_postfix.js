require('./upgradeLib')("001", function(){

    execCmd("apt-get update")
    installPackage("postfix")

});
