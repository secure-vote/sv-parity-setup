const Web3 = require('web3')
const web3 = new Web3("http://localhost:38545")

const http = require('http')
const port = 33333

const reqHandler = (request, response) => {
  const p = Promise.all(web3.eth.isSyncing(), web3.eth.getBlockNumber());
    p.then(([syncStatus, blockN]) => {
      const code = syncStatus === false ? 200 : 503;
      const body = syncStatus === false ? blockN.toString() : syncStatus.currentBlock.toString();
      response.statusCode = code;
      console.log(`Replying w status ${code} and body ${body}`);
      response.end(body);  
    }).catch(err => {
      response.statusCode = 500;
      console.log(`Error:`, err.message);
      response.end(err.message);
    });
}

const server = http.createServer(reqHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
