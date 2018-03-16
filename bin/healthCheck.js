const Web3 = require('web3')
const web3 = new Web3("http://localhost:38545")

const http = require('http')
const port = 33333

const reqHandler = (request, response) => {
  web3.eth.isSyncing()
    .then(syncStatus => {
      const code = syncStatus === false ? 200 : 503;
      const body = syncStatus === false ? 'up to date' : syncStatus.currentBlock.toString();
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
