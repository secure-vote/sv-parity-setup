require('./upgradeLib')("FILENAME", function(){

    // debug logs are super massive, like 20GB after a few days    O.O
    execCmd('cd /home/ubuntu/sv-parity-setup && ./installServices.sh', true)
    execCmd('sudo systemctl daemon-reload', true)
    execCmd('sudo systemctl stop parity && rm /mnt/eth/debug.log', true)
    execCmd('sudo systemctl start parity', true)
    execCmd('pm2 restart all')

});
