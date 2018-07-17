const Web3 = require('web3')

const http = require('http')
const port = 33333

TIMESTAMP_FAR_FUTURE = 3000000000000  // in year 2065 some time

const status = {
  // replaced leading 1 with a 2, so it's like in 2050 or something
  // set this as opening default to prevent restarting a node that's
  lastGoodTs: TIMESTAMP_FAR_FUTURE,
  lastBlock: TIMESTAMP_FAR_FUTURE
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

      // this just fills up logs
      // console.log(`Got blockN: ${blockN}, and syncStats:`, syncStatus, 'at', status.lastTs / 1000 | 0);
    }).catch(err => {
      status.code = 503;
      status.body = `Got an error: ${JSON.stringify(err)}`
      status.lastTs = (new Date()).getTime()

      // if last good ts is not default and current time is more than 10m ahead of last good time
      if ((status.lastTs >= (status.lastGoodTs + 10*60*1000)) || status.lastBlockTs < (status.lastTs - 10*60*1000)) {
        console.warn("WARNING: Health checker restarting parity")
        execCmd("sudo systemctl restart parity")
        status.lastGoodTs = TIMESTAMP_FAR_FUTURE
        status.lastBlockTs = TIMESTAMP_FAR_FUTURE
      }
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
