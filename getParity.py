#!/usr/bin/env python3

import requests
import os
import hashlib

def get_parity_release():
  r = requests.get("https://api.github.com/repos/paritytech/parity-ethereum/releases/latest")
  b = r.json()
  lines = b['body'].split('\r\n')
  pkg_line = [l for l in lines if "x86_64-unknown-linux-gnu" in l][0]
  p1 = pkg_line.split("[parity](")[1]
  (url, p2) = p1.split(") | `")
  checksum = p2.split("`")[0]
  return (url.replace("http:", "https:"), checksum)


def download_parity(url, checksum):
  print("Downloading parity from: %s" % url)
  r = requests.get(url)
  bin = r.content

  got_checksum = hashlib.sha256(bin).hexdigest()
  print("Verifying integrity of package")
  assert checksum == got_checksum
  print("Sha256 checksum verified")

  with open(os.path.expanduser("~/parity.bin"), "wb") as f:
    f.write(bin)
  print("Saved latest parity release to ~/parity.bin")


if __name__ == "__main__":
  (url, checksum) = get_parity_release()
  download_parity(url, checksum)
