#!/bin/bash

NODE_PATH=`npm root -g` node ~/bin/_cronCheckParity.js && sudo systemctl restart parity
