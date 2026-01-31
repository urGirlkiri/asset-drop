#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

NODE_EXEC=$(which node)

if [ -z "$NODE_EXEC" ]; then
    if [ -f "/usr/bin/node" ]; then
        NODE_EXEC="/usr/bin/node"
    elif [ -f "/usr/local/bin/node" ]; then
        NODE_EXEC="/usr/local/bin/node"
    else
        echo "Error: Node.js not found. Please install node." >> "/tmp/assetdrop_error.log"
        exit 1
    fi
fi

"$NODE_EXEC" "$DIR/app.js" 2>> "/tmp/assetdrop_debug.log"