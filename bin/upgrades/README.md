# upgrades readme

each upgrade script should be a node js file. They should be named _sequentially_ starting with 3 digits. Use the following template:

```
require('./upgradeLib')("LOCK_FILE_DESCRIPTION", function(){

    // do stuff here - see ./upgradeLib.js for exposed libraries and functions
    // e.g.
    if(fs.existsSync('/usr/bin/geth')){
        // do geth stuff
    }

});
```

**Note:** LOCK_FILE_DESCRIPTION should be replaced with something like "005-set-node-type-env". Use the same format (3 digits) as the filename.

## imported libraries

* `fs` - std lib
* `path` - std lib
* `child_process` - std lib
* `toml` - `require('toml-js')`

# convenience functions (and best practice)

* `fatalError(msg: string)` - call this when you want to fail out and exit with a msg
* `lockDir: string` - the directory where lockfiles are stored
* `lockFileFill: string` - full path to this lockfile
* `parityConfigPath: string` - path to parity config
* `touchFile(filepath: string)` - touches a file if it doesn't exists
* `appendFile(filepath: string, f: ((line: string) => void) )` - takes a filepath and a function - that function will be called with the first argument being a write function that takes a single line (or more I guess) and appends it to the file - does not return anything
* `execCmd(cmd: string) => {error: bool, cmd: string, output: string or error}` - takes a full cmd (e.g. `execCmd('echo "test" | tee -a ~/.somefile')`) and returns an object with keys `error, cmd, output` - `output` is either the stdout on success or the error object from `child_process.execSync` on non-0 exit
* `installPackage(pkg: string)` - runs apt-get in such a way that _should_ always require no user interaction
* `editParityConfig(f: (config) => void)` - passes the function a config object matching the parity config schema (JSON) - just mutate it in the function, no need to return - this saves the new config and backs up the old one
