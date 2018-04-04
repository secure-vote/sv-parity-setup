# One Liner Parity Setup for AWS i3 nodes

```
wget https://github.com/secure-vote/sv-parity-setup/archive/master.tar.gz && \
tar zxvf master.tar.gz && \
rm master.tar.gz && \
cd sv-parity-setup-master && \
bash setup.sh | tee setup.log
```

## Notes

**This is specific to i3 nodes - look in for disk setup / partitioning / swap / etc**

This expects you to be using ubuntu 16.04 (probs works on other Ubuntu distros too)

Config is setup in `setParityConfig.py` and is set to archive nodes (not fast / warp)

There is a little bit of user input right at the start of the setup file, but after that it's unattended

Sets up services:

* Parity - rpc on port 38545
* Health check - port 33333 - responds with block number and status 200 once fully synced

Executables in `./bin`

You should probs just skim the setup.sh script - it's pretty straight forward

Sets up the latest parity release - pulls github release data and parses for the ubuntu deb url - also verifies checksum (but doesn't verify a signature)
