#!/bin/bash

cd ~/bin/upgrades

. ~/.nvm/nvm.sh

for f in $(ls .); do
    echo "-------------------"
    echo "Running upgrade: $f"
    sudo node "./$f"
    echo "Completed $f"
done
