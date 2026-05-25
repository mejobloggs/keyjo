# Ergogen Research Results

> Generated: 2026-05-25
> Purpose: Provide enough information to build a keyboard with Ergogen, including PCB and KiCad output.
> All facts sourced from official docs, GitHub repos, and published tutorials.

---

## Quick Reference

| Item | Value |
|------|-------|
| Ergogen latest stable | v4.2.1 (npm: `ergogen`) |
| Ergogen repo | https://github.com/ergogen/ergogen (1.5k stars, 392 forks) |
| Official docs | https://docs.ergogen.xyz |
| Web UI stable | https://ergogen.xyz |
| Web UI nightly | https://ergogen.ceoloide.com |
| Community Discord | http://discord.ergogen.xyz |
| Ergogen topic | https://github.com/topics/ergogen |

## Ceoloide Ecosystem

| Repo | Purpose |
|------|---------|
| https://github.com/ceoloide/ergogen-footprints | 21+ KiCad 8-ready footprints (switches, MCUs, diodes, displays, connectors) |
| https://github.com/ceoloide/ergogen-gui | Fork of MvEerd's GUI with KiCanvas PCB preview, Monaco editor, custom footprint injection |
| https://ergogen.ceoloide.com | Live deployment ("Nightly" variant) |

## Key Versions & Compatibility

| Component | Version | Notes |
|-----------|---------|-------|
| Ergogen engine | v4.1.0+ for KiCad 8 templates | Use `template: kicad8` in PCB section |
| ceoloide-footprints | v0.0.10 (Jan 2025) | KiCad 8 only, requires `engine: 4.1.0` |
| Ergogen GUI | Node.js v20 | Will not build with v22+ |
| KiCad | 6, 7, or 8 | Different templates available |

## Config Sections

| Section | Required? | Purpose |
|---------|-----------|---------|
| `meta` | No | Engine version, author, PCB metadata |
| `units` | No | Custom variables/math (e.g., `kx: cx`, `px: kx + 2`) |
| `points` | Yes | Key positions via zones, columns, rows, anchors |
| `outlines` | No | 2D shapes for PCB edge, plate, case |
| `cases` | No | 3D extrusion of outlines for 3D printing |
| `pcbs` | No | KiCad PCB with footprints + nets (unrouted) |

## Default Units

| Symbol | Value | Meaning |
|--------|-------|---------|
| `u` | 19 | MX switch spacing (mm) |
| `U` | 19.05 | Keycap spacing (mm) |
| `cx` | 18 | Choc X spacing (mm) |
| `cy` | 17 | Choc Y spacing (mm) |

## Internal Default Variables

| Variable | Default | Override in `units:` |
|----------|---------|----------------------|
| `$default_stagger` | 0 | Column vertical offset |
| `$default_spread` | `u` | Horizontal spacing between columns |
| `$default_splay` | 0 | Column rotation angle |
| `$default_padding` | `u` | Vertical spacing between rows |
| `$default_width` | `u-1` | Demo preview keycap width |
| `$default_height` | `u-1` | Demo preview keycap height |
| `$default_autobind` | 10 | Automatic outline binding reach |

## Built-in Footprints (in ergogen core)

MX switch, Choc v1/v2 switch, Gateron KS27/KS33, diode (SMD/THT), Pro Micro (~18 pins), OLED (SSD1306), button, TRRS (PJ320A), JST PH battery, rotary encoder, mounting hole.

## Output Files

| Output | Format | Description |
|--------|--------|-------------|
| Points | YAML/JSON | Canonical key positions |
| Outlines | DXF/SVG | 2D vector shapes for PCB edge/plate/case |
| Cases | JSCAD | 3D extruded objects (convert to STL via `@jscad/cli`) |
| PCBs | `.kicad_pcb` | KiCad PCB file with footprints + nets (unrouted) |

## Resources by Topic

### Tutorials & Walkthroughs

| Resource | Author | Year | Built? | File |
|----------|--------|------|--------|------|
| 5-part Ergogen v4 series | FlatFootFox | 2023 | No | `flatfootfox-tutorial-summary.md` |
| Stana keyboard blog | Josef Adamcik | 2023 | Yes | `stana-keyboard-lessons.md` |

### Reference Docs

| Topic | File |
|-------|------|
| Official Ergogen docs (compiled) | `ergogen-docs-official.md` |
| Ceoloide footprints reference | `ceoloide-footprints.md` |
| Ceoloide GUI reference | `ceoloide-gui.md` |
| Ergogen GitHub / ecosystem | `ergogen-github-reference.md` |

---

## How This Research Applies to KeyJo

For the **KeyJo** project (CH582F, Redragon Low Profile switches, SOD-123 diodes):

1. **Footprints needed** — Redragon switches and CH582F MCU are custom footprints already written (`footprints/redragon_lowprofile.js`, `footprints/weact_ch582f.js`). The ceoloide library provides reference implementations for similar switch/MCU footprints.

2. **ceoloide-footprints patterns to follow** — Each footprint is a JS module exporting `params` + `body` function. The diode, mounting hole, and utility footprints are directly reusable if KiCad 8 is used.

3. **Config structure** — Follow the `units → points → outlines → pcbs` pattern. Use `kx`/`ky` proxy units (Choc→Redragon switch pinout will need similar proxy).

4. **Matrix wiring** — Duplex matrix technique (from Part 3) is relevant for fitting all keys to CH582F's limited pins. Row/column net assignment pattern translates directly.

5. **Ceoloide GUI** — Can be used locally to preview SVG output without running KiCad. The share-link mechanism (`lz-string` encoded) can help share configs between sessions.

6. **KiCad workflow** — After Ergogen generates the `.kicad_pcb`, manual routing is required. Part 5 provides the routing walkthrough. For CH582F, the footprint's pinout must be defined with corresponding net names (like `promicro.js` defines `P0`-`P21`, `VCC`, `GND`, `RST`, etc.).

---

## Caveats & Limitations

- **FlatFootFox tutorial was never physically built** — Follow the techniques but verify against working designs.
- **Stana keyboard was designed in KiCad directly** — Not an Ergogen project, but design decisions (Choc spacing, no plates, switch socketing) are relevant.
- **Ergogen generates unrouted PCBs** — Manual routing in KiCad is required. No auto-router in Ergogen.
- **Cases output JSCAD, not STL** — Must convert with `@jscad/cli` or web tool.
- **Ceoloide footprints require KiCad 8** — Older KiCad will fail. Use `template: kicad8` and `engine: 4.1.0+`.

---

## Discord Community

Join the [Ergogen Discord](http://discord.ergogen.xyz) for questions about custom footprints, config debugging, or routing advice.
