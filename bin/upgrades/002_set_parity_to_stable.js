require('./upgradeLib')("002", function(){

    const toml = require('toml-js');

    const c = toml.parse(fs.readFileSync(parityConfigPath));
    c['parity']['release_track'] = "stable"
    fs.writeFileSync(parityConfigPath, toml.dump(c))

    execCmd("systemctl stop parity")
    execCmd("rm -rf ~/.local/share/io.parity.ethereum-updates/");
    execCmd("systemctl start parity")

});
