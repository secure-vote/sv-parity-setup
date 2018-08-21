#!/usr/bin/env node

const toml = require('toml-js')
// const R = require('ramda')
const fs = require('fs')

const extip = process.argv[2]
console.log("Configuring ext IP as: ", extip)

if (extip.length > 15 || extip.length < 7) {
    console.log("IP address not provided, not altering config.toml")
    process.exit(0)
}

const confpath = '/mnt/eth/config.toml'
const conf = toml.parse(fs.readFileSync(confpath))

console.log("Original Config", JSON.stringify(conf))

conf.network = conf.network || {}
conf.network.nat = `extip:${extip}`

fs.writeFileSync(confpath, toml.dump(conf))

console.log("Set config to", JSON.stringify(conf))
