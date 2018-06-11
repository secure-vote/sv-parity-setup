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
    this.crypto = require('crypto')

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

    this.execCmd = (cmd, mustSucceed) => {
        console.log(`running ${cmd}`)
        try {
            return { error: false, cmd, output: child_process.execSync(cmd) }
        } catch (e) {
            console.warn(`Warning: Cmd ${cmd} errored:`, e);
            if (mustSucceed === true) {
                throw Error(`Command ${cmd} gave error: ${e}`)
            }
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
        // make a proxy where default for section is empty object
        // this only works for the _first_ layer (which is important b/c we have strings and arrays and all kinda things later on)
        let cPx = new Proxy(c, {
            get: (obj, prop) => {
                if (!(prop in obj)) {
                    obj[prop] = {}
                }
                return obj[prop]
            },
            set: (obj, prop, value) => obj[prop] = value
        })
        // call the function that edits the config file
        f(cPx)
        // commit it back to the config
        fs.writeFileSync(parityConfigPath, toml.dump(c))
    }

    this.editJsonFile = (path, f) => {
        const config = JSON.parse(fs.readFileSync(path))
        f(config)
        fs.writeFileSync(path, JSON.stringify(config, null, 4))
    }

    this.restartParity = () => {
        execCmd("systemctl restart parity")
        execCmd("/home/ubuntu/bin/restartPm2.sh")
    }

    this.randomHex = () => this.crypto.randomBytes(16).toString('hex')

    this.downloadTmpFileAndRunF = (url, f) => {
        // generate a pseudoRandom filename
        const randHex = this.randomHex()
        const filePath = `/home/ubuntu/tmpDownloadFile-${randHex}`
        // download to that file
        execCmd(`wget -O ${filePath} ${url}`)
        // run a function on it
        f(filePath)
        // clean up at end
        execCmd(`rm -rf ${filePath}`)
    }

    this.assertSha256Checksum = (filePath, checksumHex) => {
        const hash = crypto.createHash('sha256')
        const fileBuf = fs.readFileSync(filePath)
        hash.update(fileBuf)
        const checksumOut = hash.digest('hex')
        if (checksumHex !== checksumOut) {
            throw Error(`Checksum for ${filePath} did not match.\nExpected: ${checksumHex}\nResult:   ${checksumOut}`)
        }
        console.log(`Checksum of ${filePath} matches ${checksumHex}.`)
    }

    // run it!
    skipIfDone();
    mainF.apply(this, []);
    touchFile(lockFileFull);
}
