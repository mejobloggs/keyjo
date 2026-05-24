# KeyJo — Ergonomic Keyboard Project

## Overview
Split unibody ergonomic keyboard using:
- **Switches:** Redragon Low Profile (19.05mm grid, custom pinout)
- **MCU:** WeAct CH582F Core Board (RISC-V, USB-only, no BLE)
- **Diodes:** SOD-123 SMD
- **Generator:** Ergogen v4.2.1 → KiCAD 10

## Quick Start (Next Session Checklist)
1. [x] Push project to GitHub repo
2. [x] Verify 48-key layout with SVG analysis (24/half, no switch overlap)
3. [ ] Add `outlines` and `pcbs` sections to config
4. [ ] Add MCU placement (shift: [20.5, -25], rotate: -90)
5. [ ] Add diodes (SOD-123 SMD) and matrix nets (6 col + 4 row)
6. [ ] Add `npm run watch` for auto-rebuild
7. [ ] Run locally or in ergogen-gui → verify preview
8. [ ] Iterate MCU position / diode placement based on visual preview
9. [ ] Download KiCAD output → route → fabricate

## Current State
- Cornix-style layout (48 keys, 24/half, medium column stagger)
- Config has `points` section only — needs `outlines` and `pcbs` sections
- npm project set up with ergogen v4.2.1 as devDependency
- `npm run build` generates points output in `output/`
- SVG analysis confirms: 48 keys (24L + 24R), keycap outlines 20.85mm, switch bodies 14.2mm have ~5mm clearance
- Custom footprints at `footprints/redragon_lowprofile.js` and `footprints/weact_ch582f.js`
- Full specs in `docs/`
- ergogen-gui patched for local config loading (`?config=` param via symlink + dev server)
- Analysis diagram at `cornix-left-analysis.svg`

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
| `ergogen-keyjo-config.yaml` | Main Ergogen config (points section only — outlines/PCBs TODO) |
| `footprints/redragon_lowprofile.js` | Custom switch footprint (2-pin, SOD-123 diode compatible) |
| `footprints/weact_ch582f.js` | Custom MCU footprint (2x12 header, 2.54mm pitch) |
| `docs/footprints.md` | Footprint design notes and KiCAD conversion reference |
| `docs/mcu-pinout.md` | CH582F module pinout + GPIO assignments |
| `docs/firmware-plan.md` | WCH SDK, USB HID, matrix scanning, Zig roadmap |
| `HANDOVER.md` | Detailed session handover for new LLM session |
| `cornix-left-analysis.svg` | Visual diagram of left half layout with key positions |
| `output/points/` | Generated point coordinates, SVG, DXF, YAML |

## Layout Structure (Left Half)
| Column | Keys | Stagger | Notes |
|---|---|---|---|
| Pinky | 4 (top/home/bottom/extra) | 0 | Full 4-row column |
| Ring | 4 | 3mm | Full 4-row column |
| Middle | 4 | 5mm | Full 4-row column |
| Index | 3 (top/home/bottom) | -5mm | Inner column, no extra row |
| Inner | 3 | -6mm | Inner column, no extra row |
| Outer | 3 | -3mm | Inner column, no extra row |
| Thumb T1-3 | 3 (fan) | N/A | Anchored at outer_home, shift [-12, 14] |

Total: 24 keys/half × 2 = 48 keys. 6 columns × 4 rows matrix (10 GPIO).

## Matrix Wiring (Cornix Layout)
- 24 keys/half x 2 mirrored = 48 total
- 6 columns x 4 rows (thumb: 3-key fan, extra row on outer 3 cols)
- 6 col nets + 4 row nets = 10 GPIO pins
- CH582F has 22+ GPIO available

## MCU Placement
- Position: `matrix_inner_home` shifted `[20.5, -25]`
- Rotation: `-90` (USB-C faces up/away from user)
- **TODO:** Add to config outlines/pcbs and verify position

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

## TODO (Next Session)
- [ ] Add `outlines:` section (board edge shape around keys)
- [ ] Add `pcbs:` section (MCU at matrix_inner_home + shift [20.5, -25], rotate -90)
- [ ] Add diodes (SOD-123 SMD, one per switch) with matrix net wiring
- [ ] Add `npm run watch` script (chokidar/onchange)
- [ ] Run `npm run build` → generate PCB SVGs
- [ ] Iterate MCU position based on PCB SVG analysis
- [ ] Download KiCAD output → route traces → fabricate
- [ ] Pin assignment: map 6 col + 4 row nets to specific CH582F GPIO pins

## Reference Links
- Ergogen docs: https://docs.ergogen.xyz
- Ergogen web UI: https://ergogen.ceoloide.com
- Ergogen GUI repo: https://github.com/ceoloide/ergogen-gui
- WeAct CH582F repo: https://github.com/WeActStudio/WeActStudio.WCH-BLE-Core
- WCH SDK: https://github.com/openwch/ch583
- Redragon footprint source: https://github.com/rgoulter/keyboard-labs/blob/master/pcb/ProjectLocal.pretty/SW_Redragon_LowProfile_PCB_1.00u.kicad_mod
- Cornix ZMK config: https://github.com/hitsmaxft/zmk-keyboard-cornix
- CH582F split keyboard reference: https://github.com/TL605267/my_split_keyboard
