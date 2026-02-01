#!/bin/bash

# --- Configuration ---
HOST_NAME="io.assetdrop.host"
HOST_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
HOST_EXEC="$HOST_DIR/run_host.sh"
HOST_APP="$HOST_DIR/app.js"

TARGET_DIR="$HOME/.mozilla/native-messaging-hosts"
TARGET_FILE="$TARGET_DIR/$HOST_NAME.json"

echo "🔧 Setting the Bridge"
echo "   "

echo "   1. Setting execution permissions"
chmod +x "$HOST_EXEC"
if [ -f "$HOST_APP" ]; then
    chmod +x "$HOST_APP"
fi

echo "   2. Creating Firefox Native Hosts folder"
mkdir -p "$TARGET_DIR"

echo "   3. Registering manifest"

MANIFEST_CONTENT='{
  "name": "'"$HOST_NAME"'",
  "description": "Asset Drop Native Host",
  "path": "'"$HOST_EXEC"'",
  "type": "stdio",
  "allowed_extensions": [
    "asset-drop@assetdrop.io"
  ]
}'

echo "$MANIFEST_CONTENT" > "$TARGET_FILE"

echo "   "
echo "   "
echo "   Installed successfully!"
echo "   "
echo "   "