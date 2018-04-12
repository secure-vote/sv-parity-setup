require('./upgradeLib')("001", function(){

    execCmd("apt-get install -y postfix");

});
