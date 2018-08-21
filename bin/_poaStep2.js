#!/usr/bin/env node

const toml = require('toml-js')
// const R = require('ramda')
const fs = require('fs')

const address = process.env.ADDR
console.log("Configuring for address: ", address)

if (address.length != 42) {
    console.log("No address provided, not altering config.toml")
    process.exit(0)
}

const confpath = '/mnt/eth/config.toml'
const conf = toml.parse(fs.readFileSync(confpath))

console.log("Original Config", JSON.stringify(conf))

conf.mining = conf.mining || {}
conf.mining.engine_signer = address
conf.mining.reseal_on_txs = "none"
conf.mining.usd_per_tx = "0"

conf.account = conf.account || {}
conf.account.unlock = [address]
conf.account.password = "/mnt/eth/password.txt"

conf.rpc = conf.rpc || {}
conf.rpc.apis = ["all"]
conf.rpc.interface = "local"
conf.rpc.port = 8545

conf.footprint = conf.footprint || {}
conf.footprint.pruning = "fast"

fs.writeFileSync(confpath, toml.dump(conf))

console.log("Set config to", JSON.stringify(conf))
