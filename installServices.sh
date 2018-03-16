#!/bin/bash

sudo cp healthCheck.service /etc/systemd/system/
sudo systemctl enable healthCheck
sudo systemctl start healthCheck

sudo cp parity.service /etc/systemd/system/
sudo systemctl enable parity
sudo systemctl start parity
