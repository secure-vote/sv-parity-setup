require('./upgradeLib')("003-apt-update", function(){

    appendFile("/etc/cron.d/sv", write => {
        write("0 1 * * * ubuntu /usr/bin/apt-get update && /usr/bin/apt-get upgrade -y parity");
    });

    execCmd("apt-get update")
    installPackage("sysstat")

});
