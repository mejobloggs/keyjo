# FlatFootFox Ergogen v4 Tutorial — Summary

> Source: https://flatfootfox.com/ergogen-introduction/ (5-part series, Apr 2023)
> Accompanying GitHub: https://github.com/ImStuBTW/ergogen-tutorial (5 stars)
>
> **WARNING**: This tutorial keyboard was NEVER physically produced. The author states:
> "I've never actually built this example keyboard... there may be a short in the wiring somewhere,
> or the case may be slightly too snug, or the thumb keys may be brushing up against each other."
>
> Techniques are sound (based on the author's earlier ChonkV keyboard built with v3), but verify all
> design decisions against a working project before fabricating.

---

## Part 1: Units & Points

### Proxy Units Pattern
```yaml
units:
  kx: cx        # Switch width proxy
  ky: cy        # Switch height proxy
  px: kx + 2    # Padded width
  py: ky + 2    # Padded height
```
The proxy pattern (`kx`/`ky`) allows global switch type changes (Choc ↔ MX) by editing two lines.

### Zone + Matrix Structure
```yaml
points:
  zones:
    matrix:
      key:
        padding: 1ky
        spread: 1kx
      columns:
        pinky:
          rows.mod.skip: true
        ring:
          key.stagger: 5
        middle:
          key.stagger: 2.5
        index:
          key.stagger: -2.5
        inner:
          key:
            stagger: -2.5
            rotate: -4
      rows:
        mod:
        bottom:
        home:
        top:
        num:
    thumbs:
      key:
        padding: 1ky
        spread: 1kx
      anchor:
        ref: matrix_inner_mod
        shift: [2, -2]
      columns:
        layer:
          key.splay: -15
        space:
          key:
            width: 1.5kx
            splay: 75
            shift: [2, -2]
      rows:
        cluster:
```

### Key Concepts
- **Zones** = groups of keys (matrix, thumbs, etc.)
- **Columns** defined first, then rows (column-stagger oriented)
- **Stagger** = vertical offset per column (cumulative)
- **Splay** = column rotation (v4 replaces v3's `rotate`)
- **Rotate** = key fanning (different from splay)
- **Spread** = horizontal gap between columns
- **Padding** = vertical gap between rows
- **`skip: true`** = hide a key (e.g., missing mod keys)
- **Dot notation** = `rows.mod.skip: true` avoids deep nesting
- **`key:` at various levels** = inheritance from zone → column → row → key

### Anchoring Zones
```yaml
anchor:
  ref: matrix_inner_mod    # place relative to existing key
  shift: [2, -2]           # offset from that key
```

### Mirroring & Rotation
```yaml
rotate: -15                # rotate entire layout
mirror: &mirror
  ref: matrix_inner_num    # mirror around this point
  distance: 2.5kx          # separation between halves
```

---

## Part 2: Outlines

### Rectangle Outline per Key
```yaml
outlines:
  raw:
    - what: rectangle
      where: true
      size: [px, py]       # padded key size
```

### Polygon Board Outline
```yaml
  board:
    - what: polygon
      operation: stack
      points:
        - ref: matrix_outer_num
          shift: [-0.5px, 0.5py]
        - ...   # walk clockwise around board perimeter
      fillet: 2
```

### Boolean Operations
```yaml
  combo:
    - name: board          # add board outline
    - operation: subtract  # remove keys from it
      name: keys
```

### Key Takeaways
- `operation: stack` = computationally cheaper union
- `fillet: n` rounds corners
- Unit variables (`px`, `py`) enable global padding changes
- Multiple outlines can target different layers (Edge.Cuts, silkscreen, etc.)

---

## Part 3: PCBs — Matrix Theory & Net Wiring

### Keyboard Matrix Theory
- Columns + rows = total GPIO pins needed
- **Duplex matrix**: "bend" columns across both halves, doubling rows, reducing pins
- Western duplex: 6 columns × 10 rows = 16 pins (vs 12 columns × 5 rows = 17)
- Diodes ensure one-way current flow for matrix scanning

### PCB Section Structure
```yaml
pcbs:
  tutorial:
    outlines:
      main:
        outline: board
    footprints:
      choc_hotswap:
        what: choc
        where: true
        params:
          keycaps: true
          reverse: false
          hotswap: true
          from: "{{colrow}}"
          to: "{{column_net}}"
      diode:
        what: diode
        where: true
        params:
          from: "{{colrow}}"
          to: "{{row_net}}"
        adjust:
          shift: [0, -5]
```

### Net Assignment Convention
```yaml
columns:
  outer:
    key.column_net: P14
  pinky:
    key.column_net: P16
rows:
  mod:
    row_net: P15
  bottom:
    row_net: P18
  home:
    row_net: P19
  top:
    row_net: P20
  num:
    row_net: P21
```

### Mirror-side Net Override
```yaml
rows:
  mod:
    row_net: P15
    mirror.row_net: P6     # different pin for mirrored side
```

### Templating System
- `"{{colrow}}"` → column_row name (e.g., `pinky_home`)
- `"{{column_net}}"` → the key's column_net attribute
- `"{{row_net}}"` → the key's row_net attribute
- `colrow` is Ergogen's built-in convenience variable (`{{col.name}}_{{row}}`)

### MCU Placement
```yaml
promicro:
  what: promicro
  params:
    orientation: "down"
  where:
    ref.aggregate.parts: [matrix_inner_home, mirror_matrix_inner_home]
    shift: [0, 0]
    rotate: -90
```
`ref.aggregate.parts` averages two reference points (useful for centering between halves).

---

## Part 4: CLI, External Footprints & Cases

### Local Ergogen Install
```bash
npm install -g ergogen
ergogen config.yaml -o output
ergogen .                     # REQUIRED for external footprints
```

External footprints go in `./footprints/` folder, config must be `config.yaml`.

### External Footprint Usage
```yaml
# In ./footprints/mountinghole.js
# Reference in config:
footprints:
  mount:
    what: mountinghole
    where:
      ref: [matrix_outer_num]
      shift: [0.5kx, -0.3ky]
```

### Cases (3D)
```yaml
cases:
  bottom:
    - name: board
      extrude: 1
  _outerWall:
    - name: xlBoard
      extrude: 5.6
  _innerWall:
    - name: board
      extrude: 5.6
  wall:
    - what: case
      name: _outerWall
      operation: add
    - what: case
      name: _innerWall
      operation: subtract
  case:
    - what: case
      name: _standoffs
      operation: add
    - what: case
      name: _holes
      operation: subtract
    - what: case
      name: xlBottom
      operation: add
    - what: case
      name: wall
      operation: add
```

JSCAD → STL:
```bash
ergogen . && npx @jscad/cli@1 output/cases/bottom.jscad -of stla -o bottom.stl
```

---

## Part 5: KiCad Routing, Fabrication & Firmware

### KiCad Routing Process
1. Set grid to 0.2mm
2. Set rotate step to match board angle (e.g., 20°)
3. Route per-key: hotswap pad → diode pad → through hole
4. Row traces on Front copper (F.Cu, red)
5. Column traces on Back copper (B.Cu, blue)
6. Use vias to switch layers when necessary
7. Use through-hole diode pads to hop between layers without vias

### Design Rule Check (DRC)
- Run DRC before finalizing
- Common errors: unconnected SMD pads on back side, orphan trace fragments
- Fix footprint type: SMD vs Through-hole

### Gerber Export
1. File → Fabrication Outputs → Gerbers
2. Include all layers: F.Cu, B.Cu, F.Paste, B.Paste, F.Silkscreen, B.Silkscreen, F.Mask, B.Mask, Edge.Cuts
3. Then: Generate Drill Files (commonly forgotten step)
4. Zip all files → upload to fabricator

### Fabrication Options
- JLCPCB (~$18 for 5 boards + $15 shipping)
- PCBWay (5% off with `ERGOGEN` coupon code)
- OSH Park (US-based, purple PCBs, faster but pricier)

### Firmware
- **QMK**: For wired Arduino Pro Micro / RP2040
- **ZMK**: For wireless Nice!Nano
- Both need row/column pin definitions and keymap layout

### Bill of Materials (example, ~$200-300 total)
| Part | Qty | Cost |
|------|-----|------|
| PCB fabrication | 1 | $30 |
| Pro Micro | 1 | $10 |
| OLED display | 1 | $4 |
| Choc switches | 58 | $30 |
| Diodes (SMD) | 58 | $2 |
| Choc hotswap sockets | 58 | $10 |
| Reset switch | 1 | $0.50 |
| Mill Max sockets + pins | 1 | $7.50 |
| Keycaps (Choc) | 1 set | $75 |

---

## Key Techniques Relevant to KeyJo

| Technique | Where | Relevance |
|-----------|-------|-----------|
| Proxy units (`kx`/`ky`) | Part 1 | Redragon switches are also low-profile; measure pinout to define similar proxies |
| Duplex matrix | Part 3 | CH582F has limited pins; duplex matrix reduces column count |
| Net templating (`{{column_net}}`) | Part 3 | Pattern for wiring CH582F GPIO pins |
| External footprints | Part 4 | Custom `redragon_lowprofile.js` and `weact_ch582f.js` already exist |
| `ref.aggregate.parts` | Part 3 | Center MCU between keyboard halves |
| KiCad routing walkthrough | Part 5 | Step-by-step routing reference |
| DRC + Gerber export | Part 5 | Final fabrication steps |
