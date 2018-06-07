require('./upgradeLib')("012-fix-params-be-stable", function(){

    editParityConfig(c => {
        c['mining']['tx_queue_size'] = 10000
        c['parity']['release_track'] = "stable"
    })
    execCmd("rm -rf /home/ubuntu/.local/share/io.parity.ethereum-updates/")
    downloadTmpFileAndRunF("https://d1h4xl4cr1h0mo.cloudfront.net/v1.10.6/x86_64-unknown-linux-gnu/parity_1.10.6_ubuntu_amd64.deb", filePath => {
        assertSha256Checksum(filePath, "7f49be8aaf88d31750c43b5cd6787bbab43bdb970a72b3a6b3af3eb69eda0108")
        execCmd(`dpkg -i ${filePath}`)
    })
    restartParity()

});
