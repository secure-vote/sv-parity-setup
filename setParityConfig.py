#!/usr/bin/env python3

import toml
import argparse
import os

parser = argparse.ArgumentParser(description='Setup parity config')
parser.add_argument('--name', type=str, help='set name of node', required=True)
parser.add_argument('--net', type=str, help='set network', required=True)
parser.add_argument('--ram', type=int, help='MB of RAM', required=True)
parser.add_argument('--archive', action="store_true", help="If this node should be a full archive node or not")

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

    if args.net == "stopgap":
        config['parity']['chain'] = "/home/ubuntu/sv-parity-setup/stopgap-spec.json"
    else:
        config['parity']['chain'] = args.net
    print('Set parity network to %s' % args.net)

    ram = args.ram - 500  # account for some overhead
    size_db = ram // 3
    size_blocks = ram // 7
    size_queue = ram // 7
    size_state = ram // 5

    if args.net == "mainnet":
      config['footprint'] = {
        "cache_size_db": size_db,
        "cache_size_blocks": size_blocks,
        "cache_size_queue": size_queue,
        "cache_size_state": size_state
      }

    if args.archive:
        config['footprint']['pruning'] = "archive"

    config_path = '~/.local/share/io.parity.ethereum/config.toml'
    with open(os.path.expanduser(config_path), 'w') as f:
        toml.dump(config, f)
    print('Wrote Parity config to %s' % config_path)
