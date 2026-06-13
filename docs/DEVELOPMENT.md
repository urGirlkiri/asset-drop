# Development

## Tech Stack

- **WXT** - Browser extension framework
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Styling
- **Zustand** - State management with persistence

## Getting Started

```bash
npm run dev
```

This will start the development server with hot reloading for Firefox.

For Chrome development:
```bash
npm run dev:chrome
```

## Project Structure

```
src/
├── assets/          # CSS (tailwind.css), images, and static assets
├── components/      # React components
│   ├── App.tsx      # Main app with tab navigation
│   ├── Dropzone.tsx # Asset download UI
│   ├── Projects.tsx # Project management
│   ├── HistoryList.tsx # Download history
│   └── Settings.tsx # Extension settings
├── entrypoints/     # Extension entrypoints
│   ├── background.ts # Background script (downloads, messaging)
│   ├── content.ts    # Content script
│   ├── popup/        # Popup UI
│   └── sidepanel/    # Side panel UI
├── scrapers/        # Web scraping utilities (Itch.io)
├── stores/          # Zustand state stores
│   ├── useProjectStore.ts
│   ├── useSettingsStore.ts
│   └── useHistoryStore.ts
└── utils/           # Utility functions
    ├── connectToHost.ts # Native messaging connection
    ├── storage.ts       # Browser storage wrapper
    └── checkLink.ts     # URL validation
```

## Available Scripts

- `npm run dev` - Start development server (Firefox)
- `npm run dev:chrome` - Start development server (Chrome)
- `npm run build` - Build for production (Firefox)
- `npm run build:chrome` - Build for production (Chrome)
- `npm run zip` - Create distributable zip (Firefox)
- `npm run zip:chrome` - Create distributable zip (Chrome)
- `npm run compile` - TypeScript type check

## How to Debug

#### 🐧 Linux

```bash
tail -f /tmp/assetdrop_debug.log
```

#### 🪟 Windows

```powershell
Get-Content $env:TEMP\assetdrop_debug.log -Wait
```
