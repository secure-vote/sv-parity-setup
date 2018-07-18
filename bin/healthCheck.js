const Web3 = require('web3')

const http = require('http')
const port = 33333


const now = () => (new Date()).getTime()

// TIMESTAMP_FAR_FUTURE = 3000000000000  // in year 2065 some time

const status = {
  lastGoodTs: now(),
  lastBlock: now(),
  lastBlockN: 0
}


const child_process = require('child_process')

const execCmd = (cmd, mustSucceed) => {
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

const checkForStalledParity = () => {
  // current time is more than 10m ahead of last good time ()
  if ((status.lastTs >= (status.lastGoodTs + 15*60*1000)) || status.lastBlockTs < (status.lastTs - 15*60*1000)) {
    console.warn("WARNING: Health checker restarting parity")
    execCmd("sudo systemctl restart parity")
    status.lastGoodTs = now()
    status.lastBlockTs = now()
  }
}


const updateStatus = () => {
  const web3 = new Web3("http://localhost:38545")
  const p = Promise.all([web3.eth.isSyncing(), web3.eth.getBlockNumber()]);
    p.then(([syncStatus, blockN]) => {
      status.code = syncStatus === false ? 200 : 503;
      status.body = syncStatus === false ? blockN.toString() : syncStatus.currentBlock.toString();

      status.lastTs = (new Date()).getTime()
      status.lastGoodTs = (new Date()).getTime()

      if (status.lastBlockN !== blockN) {
        status.lastBlockTs = status.lastTs
        status.lastBlockN = blockN
      }

      checkForStalledParity()
    }).catch(err => {
      status.code = 503;
      status.body = `Got an error: ${JSON.stringify(err)}`
      status.lastTs = (new Date()).getTime()

      console.log(`Status: \n${JSON.stringify(status, null, 2)}`);

      checkForStalledParity()
    })
}
// update status every 1000ms
setInterval(updateStatus, 1000);

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
