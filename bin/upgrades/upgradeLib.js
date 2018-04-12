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

    this.lockDir = path.join(process.env.HOME, ".sv-upgrades")
    if (!fs.existsSync(lockDir))
        fatalError(`Updates directory (${lockDir}) does not exist`);
    this.lockFileFull = path.join(lockDir, lockFileName);

    this.parityConfigPath = path.join(process.env.HOME, ".local/share/io.parity.ethereum/config.toml");

    this.touchFile = (filepath) => fs.closeSync(fs.openSync(filepath, 'a'));

    this.skipIfDone = () => {
        if (fs.existsSync(lockFileFull)) {
            var scriptName = path.basename(__filename);
            console.log(`Skipping ${scriptName} as lockfile ${lockFileFull} exists`);
            process.exit(0);
        }
    }

    this.appendFile = (filepath, func) => {
        const file = fs.openSync(filepath, 'a');
        const write = msg => {
            fs.appendFileSync(file, "\n");
            fs.appendFileSync(file, msg);
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
            console.warning(`Warning: Cmd ${cmd} errored:`, e);
            return { error: true, cmd, output: e }
        }
    }

    // run it!
    skipIfDone();
    mainF.apply(this, []);
    touchFile(lockFileFull);
}
