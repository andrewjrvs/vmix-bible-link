# VmixBibleLink

## Development

```bash
npm run angular-start    # Start Angular dev server
npm run electron-start   # Build and launch Electron in dev mode
```

## Building for Windows

### From Windows

```bash
npm run electron-package
```

### From Linux

Install Wine first:

```bash
sudo dpkg --add-architecture i386 && sudo apt-get update && sudo apt-get install -y wine64
```

Then build:

```bash
npm run electron-package -- --win
```

The output will be in the `dist/` folder.
