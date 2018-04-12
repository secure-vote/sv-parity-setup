require('./upgradeLib')("002", function(){

    const toml = require('toml-js');

    const c = toml.parse(fs.readFileSync(parityConfigPath));
    c['parity']['release_track'] = "stable"
    fs.writeFileSync(parityConfigPath, toml.dump(c))
    // python toml ends lists like ["item","thing",] -- nodejs toml doesn't like it
    execCmd("sed -i 's/, undefined//' ~/.local/share/io.parity.ethereum/config.toml")
    execCmd("sed -i 's/,]/]/' ~/.local/share/io.parity.ethereum/config.toml")
    execCmd("sed -i 's/, ]/]/' ~/.local/share/io.parity.ethereum/config.toml")

    execCmd("ln -s /mnt/eth ~/.parity")

    execCmd("systemctl stop parity")
    execCmd("rm -rf ~/.local/share/io.parity.ethereum-updates/");
    execCmd("systemctl start parity")

});
