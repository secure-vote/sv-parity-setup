#!/usr/bin/env python3

import toml
import argparse

parser = argparse.ArgumentParser(description='Setup parity config')
parser.add_argument('name', type=str, help='set name of node')

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

    config_path = '~/.local/share/io.parity.ethereum/config.toml'
    with open(os.path.expanduser(config_path), 'w') as f:
        toml.dump(config, f)
    print('Wrote Parity config to %s' % config_path)