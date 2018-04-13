module.exports = function(lockFileName, mainF) {
    this.fatalError = (msg) => {
        console.error("FATAL ERROR:", msg);
        process.exit(99);
    }

    if (lockFileName.toString() !== lockFileName || lockFileName === "" || mainF.apply === undefined) {
        fatalError("Bad initialization of upgrade - needs lockFileName and main function to run");
    }

    this.fs = require('fs')
    this.path = require('path')
    this.toml = require('toml-js')

    this.lockDir = path.join(process.env.HOME, ".sv-upgrades")
    if (!fs.existsSync(lockDir))
        fatalError(`Updates directory (${lockDir}) does not exist`);
    this.lockFileFull = path.join(lockDir, lockFileName);

    this.parityConfigPath = path.join(process.env.HOME, ".local/share/io.parity.ethereum/config.toml");

    this.touchFile = (filepath) => fs.closeSync(fs.openSync(filepath, 'a'));

    this.skipIfDone = () => {
        if (fs.existsSync(lockFileFull)) {
            var scriptName = require.main.filename;
            console.log(`Skipping ${scriptName} as lockfile ${lockFileFull} exists`);
            process.exit(0);
        }
    }

    this.appendFile = (filepath, func) => {
        const file = fs.openSync(filepath, 'a');
        const write = msg => {
            fs.appendFileSync(file, msg);
            fs.appendFileSync(file, "\n");
        }
        func(write);
        fs.closeSync(file);
    }

    this.child_process = require('child_process')

    this.execCmd = (cmd) => {
        console.log(`running ${cmd}`)
        try {
            return { error: false, cmd, output: child_process.execSync(cmd) }
        } catch (e) {
            console.warn(`Warning: Cmd ${cmd} errored:`, e);
            return { error: true, cmd, output: e }
        }
    }

    this.installPackage = pkg => {
        return execCmd(`DEBIAN_FRONTEND=noninteractive apt-get install -y ${pkg}`)
    }

    this.editParityConfig = f => {
        execCmd("cp ~/.local/share/io.parity.ethereum/config.toml ~/.parity-config-backup-" + Math.round(Date.now() / 1000).toString())

        const c = toml.parse(fs.readFileSync(parityConfigPath));
        if (c['parity'] === undefined)
            fatalError("Parity config seems malformed")
        // call the function that edits the config file
        f(c)
        // commit it back to the config
        fs.writeFileSync(parityConfigPath, toml.dump(c))
    }

    // run it!
    skipIfDone();
    mainF.apply(this, []);
    touchFile(lockFileFull);
}
