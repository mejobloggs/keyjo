# Ceoloide Ergogen GUI

> Source: https://github.com/ceoloide/ergogen-gui
> Version: 2025-11-03 (latest release, ~736 commits)
> Fork of: MvEerd/ergogen-gui
> License: MIT

---

## What It Is

A web-based front-end for Ergogen with:
- Monaco editor (VSCode-like) for YAML editing
- Live 2D SVG preview (auto-regenerating)
- KiCanvas PCB viewer (preview PCB in browser)
- File downloads (DXF for outlines, JSCAD for cases, KiCad files for PCBs)
- Built-in ceoloide/ergogen-footprints
- Custom user footprint injection
- Example config loader from GitHub URLs
- Settings panel (debug mode, auto-generation toggle)

---

## Deployments

| URL | Type |
|-----|------|
| https://ergogen.xyz | Official stable (merged ceoloide changes) |
| https://ergogen.ceoloide.com | Ceoloide's "Nightly" build |

---

## Local Development Setup

```bash
# Requires Node.js v20 (v22+ will fail)
git clone https://github.com/ceoloide/ergogen-gui.git
cd ergogen-gui
yarn install   # also builds patched Ergogen from patch/ directory
yarn start     # opens http://localhost:3000
```

---

## Features

### Configuration Editor
- Syntax highlighting for YAML
- Auto-generation by default
- Can load example configs from GitHub URLs

### PCB Preview
- Uses KiCanvas to render the .kicad_pcb in-browser
- Switchable between outlines (SVG) and PCB (KiCanvas)

### Output Downloads
- Per-file download buttons
- All generated files listed in right panel

### Share Links
URL hash fragments using lz-string compression:
```
https://ergogen.xyz/#<lz-compressed-json>
```

Format:
```typescript
interface ShareableConfig {
  config: string;                    // YAML or KLE JSON
  injections?: [type, name, code][]; // custom footprints
}
```

Share link creation (JavaScript):
```javascript
import { compressToEncodedURIComponent } from 'lz-string';
const encoded = compressToEncodedURIComponent(
  JSON.stringify({ config: yamlConfig })
);
const link = `https://ergogen.xyz/#${encoded}`;
```

### Custom Footprints in GUI
Include custom footprints in share links via `injections` array:
```javascript
{
  config: yamlConfig,
  injections: [
    ['footprint', 'my_custom_switch', 'module.exports = { params: {...}, body: p => `...` }']
  ]
}
```

---

## Project Structure

```
ergogen-gui/
  public/         # index.html, static assets, Ergogen/KiCanvas libs
  src/
    atoms/        # Reusable UI components (Button, Input)
    molecules/    # Complex components (ConfigEditor, FilePreview)
    organisms/    # Large sections (Tabs)
    context/      # React context (ConfigContext)
    examples/     # Built-in config examples
    utils/        # Utility functions
  patch/          # Scripts & patches for Ergogen dependency
```

---

## Using a Custom Ergogen Branch

```json
// package.json dependencies
"ergogen": "ergogen/ergogen#develop"
```

Then `yarn install && yarn start`.

---

## Notes

- The official ergogen.xyz has merged ceoloide's changes
- The GUI cannot do KiCad routing — it generates unrouted PCBs only
- Template injection (custom PCB templates) is not yet supported in GUI
- For full control (custom footprints, custom templates), use the CLI
