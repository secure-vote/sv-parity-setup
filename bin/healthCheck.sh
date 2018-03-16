#!/bin/bash

NODE_PATH=`npm root -g` node `dirname $0`/healthCheck.js
