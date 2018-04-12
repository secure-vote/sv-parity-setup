require('./upgradeLib')("003-apt-update", function(){

    appendFile("/etc/cron.d/sv", write => {
        // parity doesn't seem to have a deb repo
        write("0 1 * * * root /usr/bin/apt-get update") // && /usr/bin/apt-get upgrade -y parity");
    });

    execCmd("apt-get update")
    installPackage("sysstat")

});
