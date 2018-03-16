var Web3 = require('web3')
var web3 = new Web3("http://localhost:38545");

const mkProm = f => (...args) => {
  return new Promise((res, rej) => {
    f(...args, (e, v) => { return e ? rej(e) : res(v); });
  });
};


var main = async () => {
  var n = await web3.eth.getBlockNumber();
  console.log(n);
  process.exit(0);
}


main().then(() => process.exit(0)).catch(console.log).then(() => process.exit(1));
