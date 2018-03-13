```
wget https://github.com/secure-vote/sv-parity-setup/archive/master.tar.gz && \
tar zxvf master.tar.gz && \
rm master.tar.gz && \
cd sv-parity-setup-master && \
echo "Please enter a name for this node! (e.g. eth-aws-nv-node-05)" && \
read -p "> " name && \
bash setup.sh "$name" | tee setup.log
```
