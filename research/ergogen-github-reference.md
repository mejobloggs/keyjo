# Ergogen GitHub Reference

> Source: https://github.com/ergogen/ergogen
> Branch: develop
> License: MIT
> Stars: 1.5k | Forks: 392

---

## Core Repository

```
ergogen/ergogen
├── src/
│   ├── cli.js          # Command-line entry point
│   ├── ergogen.js      # Main generator
│   ├── footprints/     # Built-in footprints
│   ├── templates/      # KiCad template versions
│   └── ...
├── test/               # Test suite (100% coverage required for PRs)
├── meta/               # Project metadata
├── roadmp.md           # Development roadmap
└── changelog.md        # Version history
```

---

## Built-in Footprints

Located at: https://github.com/ergogen/ergogen/tree/develop/src/footprints

| File | Component | Notes |
|------|-----------|-------|
| `choc.js` | Kailh Choc v1/v2 | `hotswap`, `reverse`, `keycaps` params |
| `mx.js` | Cherry MX | Similar params to choc |
| `diode.js` | 1N4148 diode | SMD and THT variants |
| `promicro.js` | Arduino Pro Micro | 18-pin layout, `orientation: up/down` |
| `button.js` | Tactile reset button | `from`, `to` params |
| `oled.js` | 0.91" OLED 128×32 | `SDA`, `SCL`, `side` params |
| `trrs.js` | PJ320A TRRS jack | For split keyboard halves |
| `jstph.js` | JST PH battery connector | For wireless builds |
| `rotary.js` | EC11 rotary encoder | |

Each footprint file defines:
- `params` — available parameters with defaults
- `body(params)` — function returning KiCad module string

---

## Built-in Templates

Located at: https://github.com/ergogen/ergogen/tree/develop/src/templates

| Template | Version | Notes |
|----------|---------|-------|
| `kicad5` | KiCad 5.x | Legacy |
| `kicad6` | KiCad 6.x | |
| `kicad7` | KiCad 7.x | |
| `kicad8` | KiCad 8.x | Required for ceoloide footprints |

Template files define:
- `convert_outline(model, layer)` — MakerJS → KiCad shape conversion
- `body(parts)` — final `.kicad_pcb` string assembly

---

## Releases & Tags

Check: https://github.com/ergogen/ergogen/releases

Latest: v4.2.1 (check GitHub for exact latest — docs reference v4.x)

The `develop` branch has bleeding-edge features. The `master` branch tracks latest stable.

---

## NPM Package

```bash
npm install -g ergogen
# or for project-local:
npm install --save-dev ergogen
```

---

## Community Projects (#ergogen topic)

Search: https://github.com/topics/ergogen

Notable community projects:
- **Absolem**: https://zealot.hu/absolem/ — the original keyboard Ergogen was built for
- **Crkbd** (Corne): https://github.com/foostan/crkbd — popular split ergo, many Ergogen configs reference it
- **SofleKeyboard**: https://josefadamcik.github.io/SofleKeyboard/ — ergonomic split (origin of the layout used in KeyJo's inspiration)

---

## Development Setup

```bash
git clone https://github.com/ergogen/ergogen.git
cd ergogen
npm install
node src/cli.js input.yaml -o output   # instead of global `ergogen`
```

---

## Contribution Guidelines

- Linear Git history required
- Always rebase on `develop`
- 100% test coverage for PRs
- Feature ideas, docs improvements, examples all welcome
- Join Discord first to discuss changes

---

## Sponsors

Notable sponsors (from ergogen repo README):
- perce (madebyperce.com)
- Cache (MvEerd — original ergogen-gui creator)
- Neil Gilmour
- ochief
- Alyx Brett
