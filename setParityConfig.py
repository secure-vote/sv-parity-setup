#!/usr/bin/env python3

import toml
import argparse
import os

parser = argparse.ArgumentParser(description='Setup parity config')
parser.add_argument('--name', type=str, help='set name of node', required=True)
parser.add_argument('--net', type=str, help='set network', required=True)

args = parser.parse_args()


def load_parity_config(**kwargs):
    with open('config.toml', 'r') as f:
        c = toml.load(f)
    return c

if __name__ == "__main__":
    config = load_parity_config()

    identity = "securevote-" + args.name 
    config['parity']['identity'] = identity
    print('Set parity identity to %s' % identity)

    config['parity']['chain'] = args.net
    print('Set parity network to %s' % args.net)
    
    if args.net == "mainnet":
      config['footprint'] = {
        "cache_size_db": 20000,
        "cache_size_blocks": 6000,
        "cache_size_queue": 6000,
        "cache_size_state": 10000
      }
    
    config['footprint']['pruning'] = "archive"

    print("Set parity footprint to: %s" % args.net)

    config_path = '~/.local/share/io.parity.ethereum/config.toml'
    with open(os.path.expanduser(config_path), 'w') as f:
        toml.dump(config, f)
    print('Wrote Parity config to %s' % config_path)
