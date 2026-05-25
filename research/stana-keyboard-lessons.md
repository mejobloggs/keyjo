# Stana Keyboard (Sofle Unsplit) — Lessons for KeyJo

> Source: https://josef-adamcik.cz/electronics/sofle-unsplit-stana-keyboard.html
> GitHub: https://github.com/josefadamcik/stanakeyboard (22 commits, 1 star)
> Author: Josef Adamcik (creator of the original SofleKeyboard)
> Year: 2023
>
> **IMPORTANT**: This board was designed directly in KiCad 7, NOT with Ergogen.
> However, the physical result and design decisions are directly relevant.

---

## The Project

Stana is a **monoblock split (unibody) keyboard** — same layout as Sofle V2 but on one PCB. It was physically manufactured and assembled successfully (second iteration with corrections).

### Physical Result (v0.1)
- ✅ PCBs fabricated at JLCPCB
- ✅ Successfully assembled
- ✅ Iterated (v0.2 with fixes based on v0.1 issues)
- ✅ 3D printed case designed

---

## Design Decisions Relevant to KeyJo

### Layout & Form Factor
- **Unibody split** (single PCB, single MCU) — same as KeyJo
- **30-degree angle between halves** — matches KeyJo's approach
- Same key layout as Sofle V2 — proven ergonomic layout

### Switch & Spacing
- **Kailh Choc v1** — low-profile switches
- **18×17mm Choc spacing** — compact, no wasted space
- **Hotswap sockets** — allows switch replacement without desoldering
- **No switch plates** — PCB-mount switches, case provides rigidity

### Microcontroller
- **WaveShare RP2040 Zero** — tiny, cheap, USB-C
- Alternative considered: Nice!Nano (wireless), Raspberry Pi Pico
- Chose RP2040 for: cost, USB-C on board, proven firmware support

### Features (Purposely Excluded)
- ❌ No rotary encoders ("never got used to them")
- ❌ No displays
- ❌ No RGB lighting ("absolutely no interest" — same as KeyJo attitude)

---

## Design Choices to Evaluate for KeyJo

| Stana Choice | KeyJo Equivalent | Notes |
|-------------|-----------------|-------|
| Choc switches (18×17mm) | Redragon Low Profile | Redragon pinout differs; measure or source spec sheet |
| WaveShare RP2040 Zero | WeAct CH582F | Both are tiny USB-C boards; CH582F is RISC-V |
| Direct KiCad design | Ergogen → KiCad | Different workflow, similar end result |
| No plates | No plates | Same approach — reduces thickness |
| 30° angle | TBD | Determine KeyJo's tenting angle |
| Hotswap sockets | Solder-only (per AGENTS.md) | Tradeoff: thinner vs swappable |
| 3D-printed case | Case TBD | Stana's case approach can be referenced |

---

## Lessons from v0.1 → v0.2 Iteration

The follow-up article (Part 7) documents what went wrong and was fixed. Key lessons:

1. **Always socket the MCU** — "of course, it happened on the one where I didn't bother to socket the microcontroller"
2. **Verify USB connector clearance** — MCU position must account for USB plug
3. **Test switch fit** before ordering many — switch availability changes
4. **3D print case early** — to catch fit issues
5. **Design for expected tools** — Stana has specific lessons about solder vs hotswap

---

## Files on GitHub

Repository: https://github.com/josefadamcik/stanakeyboard

| File | Purpose |
|------|---------|
| `SofleUnsplit.kicad_pcb` | PCB layout (KiCad native, not from Ergogen) |
| `SofleUnsplit.kicad_sch` | Schematic |
| `gerber/` | Ready-to-fabricate Gerber files |
| `case/` | 3D printable case models |
| `footprints.pretty/` | Custom KiCad footprints |
| `doc/` | Documentation images |

---

## How This Helps KeyJo

Even though Stana wasn't designed with Ergogen, it provides:

1. **Physical validation** that a unibody split with similar layout works
2. **Component selection rationale** for comparable parts
3. **Manufacturing pipeline** (JLCPCB Gerber upload → fabrication → assembly)
4. **Case design patterns** (3D printed, no switch plates)
5. **Real-world mistakes** (socket your MCU, verify USB clearance)
