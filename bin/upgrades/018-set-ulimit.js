require('./upgradeLib')("FILENAME", function(){

    // let's proactivley set the ulimit quite high to avoid any issues with parity

    execCmd(`echo "*   soft   nofile   48000" >> /etc/security/limits.conf`)
    execCmd(`echo "*   hard   nofile   200000" >> /etc/security/limits.conf`)
    execCmd(`echo "session required pam_limits.so" >> /etc/pam.d/common-session`)
    execCmd(`echo "session required pam_limits.so" >> /etc/pam.d/common-session-noninteractive`)
    execCmd(`ulimit -n 200000`)
    execCmd(`ulimit -S -n 48000`)

});
