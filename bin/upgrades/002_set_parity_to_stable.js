require('./upgradeLib')("002", function(){

    // don't need to do this anymore

    // execCmd("cp ~/.local/share/io.parity.ethereum/config.toml ~/.parity-config-backup-002")

    // const c = toml.parse(fs.readFileSync(parityConfigPath));
    // if (c['parity'] === undefined)
    //     fatalError("Parity config seems malformed")
    // c['parity']['release_track'] = "stable"
    // c['rpc']['hosts'] = ['*']
    // fs.writeFileSync(parityConfigPath, toml.dump(c))
    // // python toml ends lists like ["item","thing",] -- nodejs toml doesn't like it
    // execCmd("sed -i 's/, undefined//' ~/.local/share/io.parity.ethereum/config.toml")
    // execCmd("sed -i 's/,]/]/' ~/.local/share/io.parity.ethereum/config.toml")
    // execCmd("sed -i 's/, ]/]/' ~/.local/share/io.parity.ethereum/config.toml")

    // execCmd("ln -s /mnt/eth ~/.parity")

    // execCmd("systemctl stop parity")
    // execCmd("rm -rf ~/.local/share/io.parity.ethereum-updates/");
    // execCmd("systemctl start parity")

});
