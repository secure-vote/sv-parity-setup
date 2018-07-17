require('./upgradeLib')("FILENAME", function(){

    // pm2 restart every hour
    updateCron()

    // need to set up new service w/ logfile defined as arg
    execCmd('cd /home/ubuntu/sv-parity-setup && ./installServices.sh', true)
    execCmd('sudo systemctl daemon-reload', true)
    execCmd('sudo systemctl restart parity', true)

    // make sure we move the syslog b/c it's probs like 2.5GB
    execCmd('sudo mv /var/log/syslog.1 /mnt/eth/syslog.1.backup.7')
    execCmd('sudo mv /var/log/syslog /mnt/eth/syslog.backup.7')
    execCmd('sudo -u syslog touch /var/log/syslog && sudo chown syslog:adm /var/log/syslog')
    execCmd('sudo systemctl restart syslog')

});
