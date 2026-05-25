# KeyJo — Ergonomic Keyboard Project

## Overview
Split unibody ergonomic keyboard using:
- **Switches:** Redragon Low Profile (19.05mm grid, custom pinout)
- **MCU:** WeAct CH582F Core Board (RISC-V, USB-only, no BLE)
- **Diodes:** SOD-123 SMD
- **Generator:** Ergogen v4.2.1 → KiCAD 10

## Design Decisions
| Decision | Choice | Rationale |
|---|---|---|
| Form factor | Split unibody | Single PCB, single MCU |
| Switch type | Redragon Low Profile | User preference, 19.05mm grid |
| MCU | WeAct CH582F | RISC-V, USB-only (BLE unused) |
| Diodes | SOD-123 SMD | Smaller footprint |
| Assembly | Soldered (no hotswap) | Simpler, thinner |
| Ergogen version | 4.2.1 | Latest stable |
| Web UI | ergogen-gui (localhost:3000) | Patched for local config loading |
| Config loading | `?config=/k/config.yaml` via symlink + dev server | Direct local dev, no GitHub dependency |

## Why CH582F?
- RISC-V architecture aligns with long-term goal of writing firmware in Zig for RISC-V
- USB-only use case (BLE capabilities unused) — acceptable tradeoff
- WeAct module is cheap, well-documented, and readily available
- Alternative considered: RP2040 (better USB support, QMK/ZMK compatible) but not RISC-V

## Long-Term Goals
- Build firmware in Zig language for RISC-V
- Use WeAct CH582F USB-only (no Bluetooth)
- Custom PCB from Ergogen → KiCAD → fabrication

## File Reference
| File | Purpose |
|---|---|
| `ergogen-keyjo-config.yaml` | Main Ergogen config (empty — ready for new layout design) |
| `footprints/redragon_lowprofile.js` | Custom switch footprint (2-pin, SOD-123 diode compatible) |
| `footprints/weact_ch582f.js` | Custom MCU footprint (2x12 header, 2.54mm pitch) |
| `docs/footprints.md` | Footprint design notes and KiCAD conversion reference |
| `docs/mcu-pinout.md` | CH582F module pinout + GPIO assignments |
| `docs/firmware-plan.md` | WCH SDK, USB HID, matrix scanning, Zig roadmap |
| `research/RESEARCH-RESULTS.md` | Master index of Ergogen research (docs, tutorials, footprints, GUI) |


## Layout Structure (Left Half)
TBD

## Matrix Wiring
TBD

## MCU Placement
TBD

## Running Locally
| Command | Purpose |
|---|---|
| `npm run build` | Generate points output from config |
| `npm run watch` | Auto-rebuild on file changes (TODO) |
| `ergogen-gui` | Web UI at localhost:3000 |

## ergogen-gui Setup (for PCB SVGs)
1. Clone `ceoloide/ergogen-gui` to `~/projects/ergogen-gui`
2. `cd ~/projects/ergogen-gui && git checkout main && yarn install`
3. Copy community ergogen with our footprints over `node_modules/ergogen/dist/main.js`
4. `ln -s ~/projects/keyboard public/k` — symlink to serve config files
5. `BROWSER=none yarn start` — starts at localhost:3000
6. Open `http://localhost:3000/?config=/k/ergogen-keyjo-config.yaml`

Patches applied to ergogen-gui source:
- `src/hooks/useConfigLoader.ts` — reads `?config=` param, fetches from dev server, signals via sessionStorage
- `src/App.tsx` — skips redirect to `/new` when `?config=` present
- `src/pages/Welcome.tsx` — navigates to `/` when sessionStorage flag set

## Research
See `research/` directory for compiled Ergogen docs, footprint references, tutorial summaries, and project analysis:
- `RESEARCH-RESULTS.md` — master index and quick-reference tables
- `ergogen-docs-official.md` — full official docs compiled
- `ceoloide-footprints.md` — 21 pre-made KiCad 8 footprints
- `ceoloide-gui.md` — web GUI features and share links
- `flatfootfox-tutorial-summary.md` — 5-part tutorial key lessons (caveat: never physically built)
- `stana-keyboard-lessons.md` — physically-built unibody split reference
- `ergogen-github-reference.md` — core repo, built-in footprints, templates

## TODO (Next Session)
- [ ] Design key layout (points section in ergogen-keyjo-config.yaml)
- [ ] Add `outlines:` section (board edge shape around keys)
- [ ] Add `pcbs:` section (MCU placement — depends on layout)
- [ ] Add diodes (SOD-123 SMD, one per switch) with matrix net wiring
- [ ] Add `npm run watch` script (chokidar/onchange)
- [ ] Run `npm run build` → generate PCB SVGs
- [ ] Iterate MCU position based on PCB SVG analysis
- [ ] Download KiCAD output → route traces → fabricate
- [ ] Pin assignment: map col/row nets to CH582F GPIO pins

## Reference Links
- Ergogen docs: https://docs.ergogen.xyz
- Ergogen web UI: https://ergogen.ceoloide.com
- Ergogen GUI repo: https://github.com/ceoloide/ergogen-gui
- WeAct CH582F repo: https://github.com/WeActStudio/WeActStudio.WCH-BLE-Core
- WCH SDK: https://github.com/openwch/ch583
- Redragon footprint source: https://github.com/rgoulter/keyboard-labs/blob/master/pcb/ProjectLocal.pretty/SW_Redragon_LowProfile_PCB_1.00u.kicad_mod
- Cornix ZMK config: https://github.com/hitsmaxft/zmk-keyboard-cornix
- CH582F split keyboard reference: https://github.com/TL605267/my_split_keyboard
