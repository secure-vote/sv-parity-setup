require('./upgradeLib')("FILENAME", function(){

    execCmd(`chmod 644 /etc/cron.d/sv`)

});
