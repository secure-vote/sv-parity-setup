#!/usr/bin/env node

const toml = require('toml-js')
// const R = require('ramda')
const fs = require('fs')


const confpath = '/mnt/eth/config.toml'
const conf = toml.parse(fs.readFileSync(confpath))

console.log("Original Config", JSON.stringify(conf))

conf.secretstore = conf.secretstore || {}
conf.secretstore.disable = false

conf.rpc = conf.rpc || {}
conf.rpc.apis = ["all"]
conf.rpc.interface = "local"

conf.footprint = conf.footprint || {}
conf.footprint.pruning = "fast"

fs.writeFileSync(confpath, toml.dump(conf))

console.log("Set config to", JSON.stringify(conf))
