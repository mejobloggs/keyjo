# Ceoloide Ergogen Footprints

> Source: https://github.com/ceoloide/ergogen-footprints
> Version: v0.0.10 (Jan 2025, 236 commits, 120 stars)
> License: MIT (most footprints), CC BY-NC-SA 4.0 (infused-kim derived footprints)

---

## Requirements

- **KiCad 8 only** — set `template: kicad8` in PCB definition
- **Ergogen v4.1.0+** — set `meta.engine: 4.1.0`

## Installation

### As Git Submodule
```bash
git submodule add https://github.com/ceoloide/ergogen-footprints.git ergogen/footprints/ceoloide
# or with SSH:
git submodule add git@github.com:ceoloide/ergogen-footprints.git ergogen/footprints/ceoloide
```

### Usage in Config

The directory name (`ceoloide`) becomes the namespace prefix:

```yaml
meta:
  engine: 4.1.0
pcbs:
  main:
    template: kicad8
    outlines:
      main:
        outline: board
    footprints:
      switches:
        what: ceoloide/switch_mx    # namespace/filename (without .js)
        where: true
        params: {}
```

### For Cloning Repos Using These Footprints
```bash
git clone --recursive <repo-url>
# or for already cloned:
git submodule update --init --recursive --remote
```

---

## Available Footprints

### Switches

| Footprint File | Component | Key Params |
|---------------|-----------|------------|
| `switch_mx.js` | Cherry MX / compatible | `hotswap`, `reverse`, `from`, `to` |
| `switch_choc_v1_v2.js` | Kailh Choc (v1 & v2) | `hotswap`, `type` (choc_v1/choc_v2) |
| `switch_gateron_ks27_ks33.js` | Gateron low-profile | Similar to Choc |

### MCUs / Controllers

| Footprint File | Component | Key Params |
|---------------|-----------|------------|
| `mcu_nice_nano.js` | Nice!Nano (nRF52840) | `orientation` |
| `mcu_supermini_nrf52840.js` | SuperMini nRF52840 | `orientation` |

### Diodes

| Footprint File | Component | Key Params |
|---------------|-----------|------------|
| `diode_tht_sod123.js` | SOD-123 SMD diode | `from`, `to` |

### Displays

| Footprint File | Component | Key Params |
|---------------|-----------|------------|
| `display_ssd1306.js` | 0.91" OLED 128x32 | `side`, `SDA`, `SCL` |
| `display_nice_view.js` | Nice!View for Nice!Nano | `side`, `SDA`, `SCL` |

### LEDs

| Footprint File | Component | Key Params |
|---------------|-----------|------------|
| `led_sk6812mini-e.js` | SK6812 MINI-E (RGB) | — |

### Connectors

| Footprint File | Component | Key Params |
|---------------|-----------|------------|
| `trrs_pj320a.js` | TRRS jack (PJ320A) | — |
| `battery_connector_jst_ph_2.js` | JST PH 2-pin battery | — |
| `battery_connector_molex_pico_ezmate_1x02.js` | Molex Pico-EZmate | — |

### Power / Reset

| Footprint File | Component | Key Params |
|---------------|-----------|------------|
| `power_switch_smd_side.js` | SMD power switch | — |
| `reset_switch_smd_side.js` | SMD reset button | `from`, `to` |
| `reset_switch_tht_top.js` | THT reset button (top) | `from`, `to` |

### Rotary

| Footprint File | Component | Key Params |
|---------------|-----------|------------|
| `rotary_encoder_ec11_ec12.js` | EC11/EC12 rotary encoder | — |

### Mounting

| Footprint File | Component | Key Params |
|---------------|-----------|------------|
| `mounting_hole_npth.js` | Non-plated through hole | — |
| `mounting_hole_plated.js` | Plated through hole | — |

### Utility

| Footprint File | Component | Key Params |
|---------------|-----------|------------|
| `utility_ergogen_logo.js` | Ergogen logo silkscreen | — |
| `utility_filled_zone.js` | Copper fill zone | — |
| `utility_keepout_zone.js` | Keep-out zone | — |
| `utility_point_debugger.js` | Test point debugger | — |
| `utility_router.js` | Router helper | — |
| `utility_text.js` | Custom text silkscreen | — |

---

## Example: Using Footprints in a Config

```yaml
meta:
  engine: 4.1.0
pcbs:
  keyboard:
    template: kicad8
    outlines:
      edge:
        outline: board
    footprints:
      switches:
        what: ceoloide/switch_choc_v1_v2
        where: true
        params:
          type: choc_v1
          hotswap: true
          reverse: false
          from: "{{column_net}}"
          to: "{{colrow}}"
      diodes:
        what: ceoloide/diode_tht_sod123
        where: true
        params:
          from: "{{colrow}}"
          to: "{{row_net}}"
        adjust:
          shift: [0, -5]
```

---

## Design Notes

- Footprints at `ergogen.ceoloide.com` (the web GUI) are pre-loaded — just use `ceoloide/switch_mx` syntax
- Each footprint filename (without `.js`) is the `what` value
- Net parameters (`from`, `to`, `SDA`, `SCL`, etc.) are per-footprint — check the JS file for available params
- The `diode_tht_sod123` supports both THT and SMD variants
- Use `utility_point_debugger.js` during development to verify point positions
