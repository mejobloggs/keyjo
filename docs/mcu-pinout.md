# WeAct CH582F Module Pinout

## Physical
- Board: 38.5mm x 18mm x 1.6mm
- Header: 2x12, 2.54mm pitch, 15.24mm row spacing
- First pin offset: ~5mm from left edge
- USB-C: left short edge, flush
- No mounting holes

## Pin Mapping
| Top Row | Bottom Row |
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

## Notes
- PB10 and PB11 (on bottom row) are USB D- and D+ — handled internally by module's USB-C, not available as GPIO when USB active
- B22 (BOOT) and B23 (RST) have onboard buttons — avoid using for matrix

## GPIO Available for Matrix (planned)
| Function | Pin | Notes |
|---|---|---|
| Row 0 (bottom) | TBD | |
| Row 1 (home) | TBD | |
| Row 2 (top) | TBD | |
| Row 3 (num) | TBD | |
| Col 0 (pinky) | TBD | |
| Col 1 (ring) | TBD | |
| Col 2 (middle) | TBD | |
| Col 3 (index) | TBD | |
| Col 4 (inner) | TBD | |
| Col 5 (thumb) | TBD | |

Total: 10 GPIO needed. CH582F has 22+ available (excluding USB pins and BOOT/RST).
