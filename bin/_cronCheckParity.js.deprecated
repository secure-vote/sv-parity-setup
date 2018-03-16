var Web3 = require('web3')
var web3 = new Web3("http://localhost:38545");

var toml = require('toml-js');
var fs = require('fs');


const mkProm = f => (...args) => {
  return new Promise((res, rej) => {
    f(...args, (e, v) => { return e ? rej(e) : res(v); });
  });
};


const lockFile = process.env.HOME + '/.parityArchiveDone';
const parityConfig = process.env.HOME + '/.local/share/io.parity.ethereum/config.toml';

var main = async () => {
  var n = await web3.eth.getBlockNumber();

  if (n < 4000000) {
    process.exit(1)
  }
  
  var jobDone = fs.existsSync(lockFile);

  if (jobDone) {
    process.exit(1)
  }

  var config = fs.readFileSync(parityConfig, 'utf8');
  var c = toml.parse(config);
  console.log('got config', c);
  c['footprint']['pruning'] = 'archive';
  delete c['footprint']['pruning_history'];
  var configNew = toml.dump(c);
  console.log('writing', configNew);
  fs.writeFileSync(parityConfig, configNew, 'utf8');

  fs.writeFileSync(lockFile, 'true');

  process.exit(0);
}


main().then(console.log).then(() => process.exit(1)).catch(console.log);
