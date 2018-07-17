require('./upgradeLib')("FILENAME", function(){

    execCmd('cd /home/ubuntu/sv-parity-setup && ./installServices.sh', true)
    execCmd('sudo systemctl daemon-reload', true)
    execCmd('sudo systemctl restart healthCheck', true)

});
