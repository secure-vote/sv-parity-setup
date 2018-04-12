require('./upgradeLib')("init", function(){

    appendFile("/etc/cron.d/sv", write => {
        write("0 */12 * * * ubuntu /home/ubuntu/bin/restartPm2.sh");
        write("0 0 * * * ubuntu /home/ubuntu/bin/run_all_upgrades_cron.sh");
    });
    console.log("Added restartPm2 + auto-update to cron");

});
