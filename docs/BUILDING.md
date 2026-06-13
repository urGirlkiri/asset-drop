# Building

## Production Build

```bash
npm run build
```

This creates a production build in `.output/firefox-mv2/`.

For Chrome:
```bash
npm run build:chrome
```

## Create Distributable Zip

```bash
npm run zip
```

This creates a zip file in `.output/` that can be loaded as a temporary extension in Firefox.

For Chrome:
```bash
npm run zip:chrome
```

## Build Output

After building, the output directory contains:

- `manifest.json` - Extension manifest
- `background.js` - Background script
- `popup.html` / `sidepanel.html` - UI entrypoints
- `chunks/` - Bundled JavaScript chunks
- `assets/` - Processed CSS and images
- `icons/` - Extension icons (16px, 32px, 48px, 96px, 128px)

## Type Checking

```bash
npm run compile
```

Runs TypeScript compiler to check for type errors without emitting files.