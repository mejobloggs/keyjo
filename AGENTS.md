# KeyJo — Ergonomic Keyboard Project

## Overview
Split unibody ergonomic keyboard using:
- **Switches:** Redragon Low Profile (19.05mm grid, custom pinout)
- **MCU:** WeAct CH582F Core Board (RISC-V, USB-only, no BLE)
- **Diodes:** SOD-123 SMD
- **Generator:** Ergogen v4.2.1 → KiCAD 10

## Quick Start (Next Session Checklist)
1. [ ] Push project to GitHub repo
2. [ ] Open ergogen.ceoloide.com → connect repo → verify preview renders
3. [ ] Tweak MCU position (`shift` values in `ergogen-keyjo-config.yaml`) based on visual preview
4. [ ] Adjust diode placement if needed
5. [ ] Download KiCAD 8 output → route → fabricate

## Current State
- `ergogen-keyjo-config.yaml` renders in ergogen.ceoloide.com
- MCU position set to `[20.5, -25]` rotated `-90` — needs visual verification
- Custom footprints at `footprints/redragon_lowprofile.js` and `footprints/weact_ch582f.js`
- Full specs in `docs/`

## Design Decisions
| Decision | Choice | Rationale |
|---|---|---|
| Form factor | Split unibody | Single PCB, single MCU |
| Switch type | Redragon Low Profile | User preference, 19.05mm grid |
| MCU | WeAct CH582F | RISC-V, USB-only (BLE unused) |
| Diodes | SOD-123 SMD | Smaller footprint |
| Assembly | Soldered (no hotswap) | Simpler, thinner |
| Ergogen version | 4.2.1 | Latest stable |
| Web UI | ergogen.ceoloide.com | Supports custom footprints via GitHub |

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
| `ergogen-keyjo-config.yaml` | Main Ergogen config (points, outlines, PCBs) |
| `footprints/redragon_lowprofile.js` | Custom switch footprint |
| `footprints/weact_ch582f.js` | Custom MCU footprint |
| `docs/footprints.md` | Footprint design notes and KiCAD conversion reference |
| `docs/mcu-pinout.md` | CH582F module pinout + GPIO assignments |
| `docs/firmware-plan.md` | WCH SDK, USB HID, matrix scanning, Zig roadmap |

## Matrix Wiring
- 21 keys/half x 2 mirrored = 42 total
- 6 columns x 4 rows (thumb: home only)
- 6 col nets + 4 row nets = 10 GPIO pins
- CH582F has 22+ GPIO available

## MCU Placement
- Position: `matrix_inner_home` shifted `[20.5, -25]`
- Rotation: `-90` (USB-C faces up/away from user)
- **TODO:** Visually verify and tweak in web UI preview

## Reference Links
- Ergogen docs: https://docs.ergogen.xyz
- Ergogen web UI: https://ergogen.ceoloide.com
- WeAct CH582F repo: https://github.com/WeActStudio/WeActStudio.WCH-BLE-Core
- WCH SDK: https://github.com/openwch/ch583
- Redragon footprint source: https://github.com/rgoulter/keyboard-labs/blob/master/pcb/ProjectLocal.pretty/SW_Redragon_LowProfile_PCB_1.00u.kicad_mod
