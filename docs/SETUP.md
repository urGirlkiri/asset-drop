# Setup

## Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Firefox browser (for extension)

## Installation

```bash
git clone https://github.com/urGirlkiri/asset-drop.git
cd asset-drop
npm i
```

## Setup Native Bridge

The Native Bridge is required for the extension to save files to your disk and open folder dialogs.

### 🐧 Linux

```bash
cd host
chmod +x install.sh && ./install.sh
```

This installs the native messaging host to `/tmp/assetdrop_host.py` and registers it with your browser.

### 🪟 Windows

```bash
cd host
.\install_host.bat
```

_(Or simply double-click install_host.bat in File Explorer)_

This installs the native messaging host and registers it in the Windows registry.

## Troubleshooting

If the bridge fails to connect, check the debug logs:

- **Linux**: `tail -f /tmp/assetdrop_debug.log`
- **Windows**: `Get-Content $env:TEMP\assetdrop_debug.log -Wait`