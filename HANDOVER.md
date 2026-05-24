# KeyJo Keyboard — LLM Session Handover

## Project Snapshot
- **Goal:** Split unibody ergonomic keyboard (Cornix-inspired, 48 keys)
- **Generator:** Ergogen v4.2.1 → KiCAD 10
- **Switches:** Redragon Low Profile (19.05mm grid, SOD-123 diodes)
- **MCU:** WeAct CH582F (RISC-V, USB-only)
- **Config:** `ergogen-keyjo-config.yaml` — currently only `points` section
- **Output:** `output/points/` — SVG, DXF, YAML from `npm run build`

## What Was Done This Session

### 1. SVG Layout Verification
Parsed the rendered `demo.svg` from `output/points/` to extract key geometry:

```javascript
node -e "..."  // Parsed path d="M...L...Z" into 48 individual key shapes
```

**Verified:**
- ✅ 48 keys total (24 left, 24 right)
- ✅ Keycap outline size: 20.85mm × 20.85mm
- ✅ Switch body clearance: ~5mm (14.2mm switch vs 19.05mm grid)
- ✅ Left/right halves separated with keycap outlines barely touching (1.39mm overlap at Dwgs.User layer)
- ✅ Column stagger pattern matches Cornix design

**Layout structure (left half, sorted by x-position):**
- Outer 3 columns (pinky/ring/middle): 4 rows each (top/home/bottom/extra)
- Inner 3 columns (index/inner/outer): 3 rows each (top/home/bottom)
- Thumb fan: 3 keys (T1-T3) anchored at `matrix_outer_home` with `[-12, 14]` shift
- Board rotated -10°

### 2. ergogen-gui Setup (Local Web UI)
Installed and patched `ceoloide/ergogen-gui` for local config loading:

- **Clone:** `~/projects/ergogen-gui` (main branch, yarn install)
- **Symlink:** `public/k` → `~/projects/keyboard` (serves config files)
- **Run:** `BROWSER=none yarn start` → localhost:3000
- **Open:** `http://localhost:3000/?config=/k/ergogen-keyjo-config.yaml`

**Patches applied to ergogen-gui source (3 files):**
1. `src/hooks/useConfigLoader.ts` — added `?config=` URL param fetch + sessionStorage signal
2. `src/App.tsx` — skip redirect to `/new` when `?config=` present
3. `src/pages/Welcome.tsx` — auto-navigate to `/` when sessionStorage flag is set

**Important:** `BROWSER=none` prevents WSL from trying (and failing) to open PowerShell-popup browser. The community ergogen binary must be manually copied over `node_modules/ergogen/dist/main.js` to include custom footprints.

### 3. Documentation Updated
- `AGENTS.md` — full state, checklist, design decisions, file reference
- `cornix-left-analysis.svg` — visual diagram of left half with coordinates
- This `HANDOVER.md`

## Key Decisions
| Decision | Choice | Rationale |
|---|---|---|
| Layout | Cornix-style (48 keys, 24/half) | Medium column stagger, thumb fan |
| Row order | top/home/bottom/extra | extra = lowest (closest to user) |
| Thumb fan | spread:14, stagger:5, splay:10° | 3 keys, anchored at outer_home + [-12,14] |
| Mirror distance | 58mm | Clean gap between thumb fans |
| 3-row columns | index/inner/outer | skip:true on column + selective row un-skip |
| Config loading | `?config=` via dev server symlink | Direct local dev, no GitHub dependency |

## Files Reference

| Path | Purpose | Status |
|---|---|---|
| `ergogen-keyjo-config.yaml` | Main Ergogen config (points only) | ✅ Working — needs outlines+pcbs |
| `footprints/redragon_lowprofile.js` | Redragon switch (2-pin, SOD-123) | ✅ Custom, 14.2mm body, 19.05mm keycap |
| `footprints/weact_ch582f.js` | CH582F MCU (2x12 header) | ✅ Custom, 38.5×18mm board |
| `docs/footprints.md` | Footprint design notes | ✅ Up to date |
| `docs/mcu-pinout.md` | CH582F pinout + GPIO plan | ✅ Up to date (pins TBD) |
| `docs/firmware-plan.md` | Firmware roadmap (C→Zig) | ✅ Up to date |
| `AGENTS.md` | Session state, checklist, decisions | ✅ Updated |
| `HANDOVER.md` | This file | ✅ New |
| `cornix-left-analysis.svg` | Visual layout diagram | ✅ Updated |
| `output/points/` | Generated points (svg, yaml, dxf) | ✅ Latest build |
| `package.json` | npm project (ergogen devDep) | ✅ Working |

## Project Config (ergogen-keyjo-config.yaml)

Current structure (65 lines, points only):

```yaml
points:
    zones:
        matrix:
            columns:
                pinky: {}                          # stagger: 0
                ring:    key.stagger: 3
                middle:  key.stagger: 5
                index:   key.stagger: -5, skip: true  # 3 rows un-skipped
                inner:   key.stagger: -6, skip: true  # 3 rows un-skipped
                outer:   key.stagger: -3, skip: true  # 3 rows un-skipped
            rows:
                top: {}
                home: {}
                bottom: {}
                extra: {}
        thumbfan:
            anchor: { ref: matrix_outer_home, shift: [-12, 14] }
            columns:
                t1: key.spread: 14
                t2: key.spread: 14, stagger: 5, splay: 10
                t3: key.spread: 14, stagger: 5, splay: 10
            rows:
                thumb: {}
    rotate: -10
    mirror:
        ref: matrix_outer_home
        distance: 58
```

### Key Coordinate Reference (Left Half, unrotated)
From `output/points/points.yaml`:

| Key | x | y |
|---|---|---|
| matrix_pinky_top | 0.0 | 0.0 |
| matrix_pinky_home | -3.3 | 18.7 |
| matrix_pinky_bottom | -6.6 | 37.4 |
| matrix_pinky_extra | -9.9 | 56.1 |
| matrix_ring_top | 19.2 | 0.0 |
| matrix_ring_home | 15.9 | 18.7 |
| matrix_ring_bottom | 12.6 | 37.4 |
| matrix_ring_extra | 9.3 | 56.1 |
| matrix_middle_top | 38.8 | 0.0 |
| matrix_middle_home | 35.5 | 18.7 |
| matrix_middle_bottom | 32.2 | 37.4 |
| matrix_middle_extra | 28.9 | 56.1 |
| matrix_index_top | 59.6 | -5.0 |
| matrix_index_home | 56.3 | 13.7 |
| matrix_index_bottom | 53.0 | 32.4 |
| matrix_inner_top | 79.7 | -6.0 |
| matrix_inner_home | 76.4 | 12.7 |
| matrix_inner_bottom | 73.1 | 31.4 |
| matrix_outer_top | 92.5 | -22.4 |
| matrix_outer_home | 95.8 | -3.7 |
| matrix_outer_bottom | 99.1 | 15.0 |
| thumbfan_t1_thumb | 86.4 | 12.2 |
| thumbfan_t2_thumb | 101.1 | 14.7 |
| thumbfan_t3_thumb | 115.1 | 19.7 |

After mirror (right half): mirror key at distance=58 from `matrix_outer_home`, rotated +10°.

## MCU Placement (Planned)
- **Reference:** `matrix_inner_home` (center of inner column, home row)
- **Shift:** [20.5, -25] (20.5mm right, 25mm up — toward thumb cluster gap)
- **Rotation:** -90° (USB-C faces up/away from user)
- **Rationale:** Sits in the empty space between the thumb fan and the inner column
- **Status:** Needs to be added to `pcbs:` section

### MCU Pinout (for matrix wiring)
| Top Row | Bottom Row | GPIO Available |
|---|---|---|
| G | A8 | ✓ |
| 5V | A9 | ✓ |
| G | B15 | ✓ |
| 3V3 | B14 | ✓ |
| A10 | B13 | ✓ |
| A11 | B12 | ✓ |
| A12 | B11 | USB D- |
| A13 | B10 | USB D+ |
| A14 | B7 | ✓ |
| A15 | B4 | ✓ |
| A5 | BOOT (B22) | Avoid (button) |
| A4 | RST (B23) | Avoid (button) |

**Available GPIO: 22+** (excluding B10/B11=USB, B22/B23=BOOT/RST)

## Matrix Wiring Plan
- 6 columns × 4 rows = 10 GPIO pins (max 24 keys per half scanned)
- 6 column nets, 4 row nets
- Diodes: SOD-123 SMD, cathode toward column (standard row-to-column scanning)
- Total GPIO needed: 10 — CH582F has plenty

### ergogen-gui Config Format
In the `pcbs:` section, use:
```yaml
pcbs:
    pcb1:
        footprints:
            - type: weact_ch582f
              net: ...
              at: matrix_inner_home
              shift: [20.5, -25]
              rotate: -90
```

Diodes and switch nets require net names in the footprint params. See Ergogen docs for `net` syntax.

## Commands
| Command | Purpose |
|---|---|
| `npm run build` | Run ergogen → generates SVG/DXF/YAML in `output/` |
| `npm run watch` | TODO: add chokidar/onchange for auto-rebuild |

## Ghosts in the Machine
1. **ergogen-gui restarts:** The `public/` symlink is only read on dev server start. Changing symlink target requires restart.
2. **PowerShell popup:** WSL's `yarn start` tries to open browser in Windows; `BROWSER=none` suppresses it.
3. **WSL file access:** Windows apps can't see WSL filesystem via `\\wsl$\Ubuntu\...` — but this works for copying SVG/KiCAD files to Windows.
4. **community ergogen binary:** Must manually replace `node_modules/ergogen/dist/main.js` with community build to support custom footprints.
5. **ergogen-gui source patches:** Not committed to the ergogen-gui repo — they're local-only changes. May need re-application if ergogen-gui is updated.

## Next Steps (Priority Order)
1. **Add `outlines:` section** — define board edge shape around key positions
2. **Add `pcbs:` section** — MCU placement (matrix_inner_home + [20.5, -25], -90°)
3. **Add diodes** — one SOD-123 per switch with matrix net wiring (6 col + 4 row nets)
4. **Add `npm run watch`** — chokidar CLI or onchange package
5. **Run build** → inspect PCB SVG in ergogen-gui
6. **Iterate** MCU position and diode placement
7. **Pin assignment** — map 6 col/4 row nets to specific CH582F GPIO pins
8. **Download KiCAD output** → route traces → fabricate

### Diode Wiring Detail
Each switch in the matrix needs:
- One SOD-123 diode (cathode → column net, anode → row net)
- `from:` and `to:` params on the switch footprint for net assignment
- Net naming pattern: `col_0`..`col_5` and `row_0`..`row_3`

### Specific ergogen-gui setup commands (for reference):
```bash
cd ~/projects/ergogen-gui
git checkout main
yarn install
# Copy community ergogen (with footprints support) over node_modules
cp ~/Downloads/ergogen-community-dist/main.js node_modules/ergogen/dist/
# Create symlink for config files
ln -s ~/projects/keyboard public/k
# Start (no browser)
BROWSER=none yarn start
# Open in browser:
# http://localhost:3000/?config=/k/ergogen-keyjo-config.yaml
```
