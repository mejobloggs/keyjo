# Custom Footprints

Source files in `footprints/` — these are loaded by ergogen.ceoloide.com when the repo is connected.

## redragon_lowprofile.js

**Source:** Converted from `SW_Redragon_LowProfile_PCB_1.00u.kicad_mod` by rgoulter

**Pin positions (from original KiCad footprint):**
- Pin 1: (3.8, 3.8) — 2.2mm pad, 1.2mm drill
- Pin 2: (0, 6.5) — 2.2mm pad, 1.2mm drill
- Center: (0, 0) — 4.4mm np_thru_hole
- Silk: 14.2mm square (F.SilkS)
- Keycap box: 19.05mm square (Dwgs.User)
- Courtyard: 14.5mm square (F.CrtYd)
- Fab: 14mm square (F.Fab)

**Params:** `from` (net), `to` (net), `keycaps` (bool)

## weact_ch582f.js

**Board specs (measured from physical module):**
- Dimensions: 38.5mm x 18mm
- Header: 2x12 pins, 2.54mm pitch, 15.24mm row spacing
- First pin offset: ~5mm from left board edge
- USB-C: left short edge, flush with board

**Pinout:**
| Top row (L->R) | Bottom row (L->R) |
|---|---|
| G | A8 |
| 5V | A9 |
| G | B15 |
| 3V3 | B14 |
| A10 | B13 |
| A11 | B12 |
| A12 | B11 |
| A13 | B10 |
| A14 | B7 |
| A15 | B4 |
| A5 | BOOT (B22) |
| A4 | RST (B23) |

**No mounting holes.**

## Creating New Footprints

To convert a KiCad footprint to Ergogen:
1. Place the raw KiCad `(module ...)` text in the `body` return string
2. Replace fixed `(at x y r)` with `${p.at}` for parametric positioning
3. Add `p.ref` for reference designator, `p.ref_hide` for visibility
4. Replace pin net connections with parameter references (e.g., `${p.from}`, `${p.to}`)
5. Use `p.isxy(x, y)` for internal symmetric positioning (handles mirroring)
6. Declare all params in the `params` object with default values

Reference: https://docs.ergogen.xyz/pcbs#footprints
