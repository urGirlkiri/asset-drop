# Asset Drop

Download assets from any asset store into your game engine.


## How to Setup Native Bridge

### 1. Make the host scripts executable
chmod +x host/run_host.sh
chmod +x host/app.cjs

### 2. Create the Firefox Native Hosts folder (if missing)
mkdir -p ~/.mozilla/native-messaging-hosts/

### 3. Register the manifest
cp host/io.assetdrop.host.json ~/.mozilla/native-messaging-hosts/

## How to Use

### Zip Extension

npm run zip

### Load Temporary Extension