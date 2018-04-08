#!/usr/bin/env node

const fs = require('fs');

const config = JSON.parse(fs.readFileSync("app.json"));

config[0].name = "eth-sv-stats"
config[0].env.RPC_PORT = "38545"
config[0].env.INSTANCE_NAME = `SecureVote-${process.env.NODE_NAME || 'unk-sv-node'}`
config[0].env.CONTACT_DETAILS = "max@secure.vote"
config[0].env.WS_SERVER = `wss://${process.env.ETH_NETWORK}.stats.secure.vote`
config[0].env.WS_SECRET = 'PhXDh8nTTPwBYnx7l8AEfoFOol8TnBAbxB'

fs.writeFileSync("app.json", JSON.stringify(config));
