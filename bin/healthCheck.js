const Web3 = require('web3')

const http = require('http')
const port = 33333

const status = {}

const updateStatus = () => {
  const web3 = new Web3("http://localhost:38545")
  const p = Promise.all([web3.eth.isSyncing(), web3.eth.getBlockNumber()]);
    p.then(([syncStatus, blockN]) => {
      status.code = syncStatus === false ? 200 : 503;
      status.body = syncStatus === false ? blockN.toString() : syncStatus.currentBlock.toString();
      status.lastTs = (new Date()).getTime()
      console.log(`Got blockN: ${blockN}, and syncStats:`, syncStatus, 'at', status.lastTs / 1000 | 0);
    }).catch(err => {
      status.code = 503;
      status.body = `Got an error: ${JSON.stringify(err)}`
      status.lastTs = (new Date()).getTime()
    })
}
// update status every 500ms
setInterval(updateStatus, 500);

const reqHandler = (request, response) => {
  const now = (new Date()).getTime()
  if (now - status.lastTs > 5000) {
    response.statusCode = 503
    response.end(`Node has not responded in >= 5s. Last: ${stats.lastTs / 1000 | 0}`)
  } else {
    response.statusCode = status.code;
    console.log(`Replying w status ${status.code} and body ${status.body}`);
    response.end(status.body);
  }
}

const server = http.createServer(reqHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})
