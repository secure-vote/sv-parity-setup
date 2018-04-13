require('./upgradeLib')("006-mail-utils-and-cron-fix", function(){

    installPackage('mailutils');
    appendFile("/etc/cron.d/sv", w => {
        // this should help fix up any broken cron files - will end up appending empty newline
        w("");
    })

});
