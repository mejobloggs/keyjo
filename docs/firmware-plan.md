# Firmware Plan

## Toolchain (Medium Term — C)
- WCH MounRiver Studio (IDE) or command-line WCH toolchain
- SDK: https://github.com/openwch/ch583 (covers CH582/CH583)
- Flash tool: WCHISPTool (USB bootloader via BOOT button)
- Reference projects:
  - https://github.com/TL605267/my_split_keyboard — CH582F split keyboard in C
  - https://github.com/pymo/wch_micro_kbd — CH582F keyboard controller (BT-focused but has USB code)

## USB HID Keyboard
- CH582F has built-in USB 2.0 full-speed device controller
- SDK includes USB device examples in `Application/`
- Need to implement:
  1. HID keyboard report descriptor (6KRO or NKRO)
  2. USB interrupt endpoint for HID reports
  3. Report structure: modifier keys + keycodes

## Matrix Scanning
- 6 columns x 4 rows = 21 active keys per half (42 total)
- Scan pattern: drive columns LOW, read rows with pull-ups (or vice versa)
- Debounce: software-based, ~5-10ms
- Key mapping: physical position -> HID usage code

## Long-Term: Zig Firmware
- **Goal:** Write firmware in Zig for RISC-V
- CH582F uses Qingke V4A RISC-V core (RV32IMAC)
- Required Zig work:
  1. Verify Zig RISC-V target supports CH582F
  2. Create custom linker script for CH582F memory map (32KB SRAM, 448KB Flash)
  3. Write startup code (vector table, init, .data/.bss)
  4. Map CH582F peripheral registers (USB, GPIO, timers)
  5. Write USB HID driver from scratch
- This is a significant undertaking — C firmware first, then port to Zig
