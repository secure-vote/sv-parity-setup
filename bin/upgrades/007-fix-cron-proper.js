require('./upgradeLib')("007-fix-cron-proper", function(){

    fs.writeFileSync("/etc/cron.d/sv", `SHELL=/bin/bash
0 */12 * * * ubuntu /home/ubuntu/bin/restartPm2.sh
0 0 * * * ubuntu /home/ubuntu/bin/run_all_upgrades_cron.sh
0 1 * * * root /usr/bin/apt-get update
`)
    execCmd("systemctl restart cron")

});
