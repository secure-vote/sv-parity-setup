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
        fs.mkdirSync(lockDir)
    this.lockFileFull = path.join(lockDir, lockFileName);

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


    // run it!
    skipIfDone();
    mainF.apply(this, []);
    touchFile(lockFileFull);
}
