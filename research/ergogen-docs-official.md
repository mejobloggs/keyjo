# Ergogen Official Documentation (Compiled)

> Source: https://docs.ergogen.xyz
> Compiled: 2026-05-25
> This is a condensed reference of all official docs sections.

---

## 1. Config Overview

The heart of Ergogen is a single YAML/JSON config file. JavaScript that evaluates to a config object is also supported.

```yaml
meta: <metadata>       # optional
units: <units config>  # optional
points: <points config> # required
outlines: <outlines>   # optional
cases: <cases>         # optional
pcbs: <pcbs>           # optional
```

---

## 2. Preprocessing

Runs before config interpretation. Steps:

### 2.1 Unnesting
Dotted keys are unnested. `nested.key.def: value` → `{nested: {key: {definition: value}}}`

### 2.2 Inheritance ($extends)
```yaml
parent:
  a: 1
  b: 2
child:
  $extends: parent
  c: 3
```
Result: `child = {a: 1, b: 2, c: 3}`

Rules:
- `undefined` new value: old value used as default
- Both defined, same type: new overrides
- Different types: new takes precedence
- `$unset`: removes the value
- Arrays/objects: recursive element-wise extension

### 2.3 Parameterization
```yaml
template:
  value: placeholder
  double: placeholder * 2
  $params: [placeholder]
  $args: [3]
```
Every occurrence of "placeholder" replaced with "3".

### 2.4 Skipping
`$skip: true` comments out a declaration (useful for intermediate abstract declarations in inheritance chains).

### 2.5 Math
String values that are math formulas are evaluated. Works with variables/units.

---

## 3. Metadata

```yaml
meta:
  engine: 4.1.0    # Semver compatibility check. "4.1.0" means ">=4.1.0, <5.0.0"
  version: 1.0     # Embedded in KiCad PCB metadata
  author: "Name"   # Embedded in KiCad PCB metadata
```

---

## 4. Units

Predefined:

```
U: 19.05  # MX keycap spacing
u: 19     # MX switch spacing
cx: 18    # Choc X spacing
cy: 17    # Choc Y spacing
```

Custom:

```yaml
units:
  kx: cx          # proxy for Choc X
  ky: cy          # proxy for Choc Y
  px: kx + 2      # padded width
  py: ky + 2      # padded height
  screwSize: 1.5  # custom values
```

Internal default variables (overrideable in units):

```
$default_stagger: 0
$default_spread: 'u'
$default_splay: 0
$default_height: 'u-1'
$default_width: 'u-1'
$default_padding: 'u'
$default_autobind: 10
```

---

## 5. Points

Defines key positions. The most complex section.

### 5.1 Coordinate System
- X: positive right, negative left
- Y: positive upward, negative downward
- Rotation: counter-clockwise (+90° = left, -90° = right)
- Points represented as `[x, y, r°]`

### 5.2 Anchors

Used to compute point positions from existing points rather than absolute coordinates.

**String**: reference to existing point by name.
```yaml
anchor: existing_point_name
```

**Array**: multi-part anchor (chained).
```yaml
anchor:
  - orient: 45
    shift: [1, 0]
    rotate: 135
  - shift: [1, 0]
    rotate:
      shift: [0, 0]
```

**Object**: full declaration with fields:
- `ref`: starting point (recursive anchor)
- `aggregate`: combine multiple points (`parts: [...]`, `method: average`)
- `orient`: pre-rotation (number or sub-anchor to "turn towards")
- `shift: [x, y]`: translate (relative to current rotation)
- `rotate`: post-rotation (number or sub-anchor)
- `affect`: `"x"`, `"y"`, `"r"` — constrain which fields are modified
- `resist`: `true` prevents mirror auto-inversion of shifts/rotations

### 5.3 Zones

```yaml
points:
  key: <defs>  # global defaults for all zones
  zones:
    <zone_name>:
      anchor: <anchor>  # positioning this zone
      key: <defs>       # zone-level defaults
      columns:
        <col_name>:
          key: <defs>   # column-level defaults
          rows:
            <row_name>: <defs>  # key-specific overrides
      rows:
        <row_name>: <defs>  # row-level defaults
```

### 5.4 Inheritance Order
1. Built-in hardcoded defaults
2. Global `points.key`
3. Zone-level `points.zones.<zone>.key`
4. Column-level `points.zones.<zone>.columns.<col>.key`
5. Row-level `points.zones.<zone>.rows.<row>`
6. Key-specific `points.zones.<zone>.columns.<col>.rows.<row>`

Note: levels 2-3-4 use `.key` suffix; levels 5-6 do NOT (they ARE key definitions).

### 5.5 Key-level Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `stagger` | number | 0 | Vertical shift for column start (cumulative) |
| `spread` | number | `u` | Horizontal space to next column |
| `splay` | number | 0 | Column rotation around `origin` |
| `padding` | number | `u` | Vertical gap to next row |
| `orient` | number/list | 0 | Pre-rotation for cumulative positioning |
| `shift` | [x, y] | [0,0] | Translation for cumulative positioning |
| `rotate` | number/list | 0 | Post-rotation for cumulative positioning |
| `adjust` | anchor | {} | Applies independently (non-cumulative) |
| `bind` | various | -1 | Outline neighbor reach ([t,r,b,l]) |
| `autobind` | number | 10 | Auto bind reach |
| `skip` | boolean | false | Skip this point in output |
| `asym` | string | "both" | Which side: "both", "source", "clone" |
| `mirror` | object | {} | Mirror-side key-level overrides |
| `colrow` | string | auto | `{{col.name}}_{{row}}` |
| `name` | string | `{{zone}}_{{colrow}}` | Globally unique key name |
| `width`/`height` | number | `u-1` | Keycap dimensions (demo only) |

### 5.6 Templating
Double curly braces insert key-level attributes: `{{col.name}}_{{row}}` → `pinky_home`

### 5.7 Mirroring

```yaml
points:
  zones: ...
  rotate: -20                     # rotate whole board
  mirror: &mirror
    ref: matrix_inner_num         # point to mirror around
    distance: 2.5kx               # separation distance
```

Mirrored points get `mirror_` prefix. `mirror` key can override attributes for mirrored side only. `asym: source | clone | both` controls which side keys appear on.

`resist: true` on an anchor prevents auto-inversion of shifts/rotations on mirrored points.

### 5.8 Layout Process
1. Zone anchor → initial column anchor
2. For each column: apply stagger/splay relative to previous column, then spread
3. For each row in column: apply orient/shift/rotate cumulatively, then padding
4. Apply `adjust` independently at the end
5. Mirror: entire zone is duplicated with X-inversion

---

## 6. Outlines

### 6.1 Binding
Explicit: `bind: num | [num_x, num_y] | [num_t, num_r, num_b, num_l]`
Auto: `autobind: num` (default 10mm reach)

### 6.2 Filtering

| Input Type | Behavior |
|-----------|----------|
| `undefined` | Returns `[0,0,0°]` origin |
| `true` | All points |
| `false` | No points |
| `string` | Match by name OR tag (supports regex `/pattern/` and negation `-pattern`) |
| `object`/`complex array` | Parsed as anchor |
| `simple array` | AND/OR logic: odd nesting = OR, even = AND |

Tags are key-level attributes: `tags: [alpha, thumb]` on a key lets you filter by `tags: alpha`.

Full filter form: `meta.name,meta.tags ~ value` (default). Custom: `meta.myfield ~ value`.

### 6.3 Common Part Attributes

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `what` | rectangle, circle, poly, outline | — | Shape type |
| `where` | filter/anchor | — | Placement |
| `operation` | add, subtract, intersect, stack | add | Boolean operation |
| `bound` | boolean | false | Enable binding |
| `asym` | source, clone, both | source | Mirror filtering |
| `adjust` | anchor | {} | Position adjustment |
| `scale` | number | 1 | Size multiplier |
| `expand` | number | 0 | Outline expansion (negative = shrink) |
| `joints` | round(0), pointy(1), beveled(2) | round | Corner treatment during expand |
| `fillet` | number | 0 | Corner rounding radius |

### 6.4 Shapes

**rectangle**: `size: [w, h]`, `bevel: num`, `corner: num`
**circle**: `radius: num`
**poly**: `points: [anchor, anchor, ...]`
**outline**: `name: outline_ref`, `origin: anchor`

### 6.5 Syntactic Sugar
- String shorthands: `+name` (add), `-name` (subtract), `~name` (intersect), `^name` (stack)
- Expand+joints shorthand: `3)` (round), `3>` (pointy), `3]` (beveled)
- Private outlines: prefix with underscore (e.g., `_helper`) — not exported

### 6.6 Outline Section Format

```yaml
outlines:
  <name>:
    - what: rectangle
      where: true        # at every key
      size: [px, py]
    - what: polygon
      operation: stack
      points:
        - ref: matrix_outer_num
          shift: [-0.5px, 0.5py]
        - ...
      fillet: 2
  <combined>:
    - name: board        # shorthand: add "board" outline
    - operation: subtract
      name: keys
```

---

## 7. Cases

Extrudes 2D outlines into 3D. Exports as .jscad (not .stl directly).

```yaml
cases:
  bottom:
    - name: board         # reference outline
      extrude: 1          # height in mm
  _outerWall:
    - name: xlBoard
      extrude: 5.6
  _innerWall:
    - name: board
      extrude: 5.6
  wall:
    - what: case          # reference another case
      name: _outerWall
      operation: add
    - what: case
      name: _innerWall
      operation: subtract
```

- `what: outline` (default) or `what: case`
- `name`: reference to outline or previous case
- `extrude`: mm height for outlines
- `shift: [x, y, z]`, `rotate: [ax, ay, az]`
- Private case: prefix with `_` (not exported but available for composition)
- String shorthands work like outlines

JSCAD → STL conversion:
```bash
npx @jscad/cli@1 output/cases/bottom.jscad -of stla -o bottom.stl
```

---

## 8. PCBs

### 8.1 PCB Section Format

```yaml
pcbs:
  <pcb_name>:
    outlines:
      - outline: <ref>      # reference to existing outline
        layer: Edge.Cuts    # KiCad layer
    footprints:
      - what: <footprint_name>
        where: <filter>
        asym: both
        adjust: <anchor>
        params:
          key1: value1
          <templated_key>: "{{key_level_attr}}"
    references: false       # show component refs on PCB
    template: kicad8        # KiCad template version
    params: {}              # custom template params
```

### 8.2 Nets and Templating

Key-level attributes can be passed as footprint parameters:

```yaml
footprints:
  - what: choc
    where: true
    params:
      from: "{{column_net}}"   # reads key's column_net attribute
      to: "{{colrow}}"         # built-in column-row name
```

This is how each key gets its unique net connections.

### 8.3 Custom Footprint Format

```javascript
module.exports = {
  params: {
    designator: '_',       // prefix for component ref (e.g., D for diode)
    bool_param: true,
    string_param: 'default',
    number_param: 42,
    net_param: {type: 'net', value: 'GND'},
    anchor_param: {type: 'anchor', value: 'point_name'}
  },
  body: parsed_params => {
    return `(module something (layer something)
      ${parsed_params.at}
      ...
      (pad 1 thru_hole circle (at ${parsed_params.isxy(1,0).str}) ...)
    )`
  }
}
```

### 8.4 Footprint Coordinate Functions

| Function | Use Case | Mirror Behavior |
|----------|----------|-----------------|
| `isxy(x, y)` | Internal (inside module) + Symmetric | X-inverts for mirror |
| `iaxy(x, y)` | Internal + Asymmetric | No inversion |
| `esxy(x, y)` | External (outside module) + Symmetric | X-inverts for mirror |
| `eaxy(x, y)` | External + Asymmetric | No inversion |

### 8.5 Template Format

```javascript
module.exports = {
  convert_outline: (model, layer) => { /* MakerJS → KiCad shapes */ },
  body: parts => { /* assemble final .kicad_pcb string */ }
}
```

Parts object:
- `name`, `version`, `author` — from meta
- `nets: {name: index}` — all nets
- `footprints: [text]` — precomputed footprint strings
- `outlines: {name: text}` — converted outlines
- `custom: {}` — from `pcbs.<pcb_name>.params`

---

## 9. File Formats

### Input
- YAML, JSON
- JavaScript (evaluated to produce config object)
- Bundles (.zip/.ekb) for custom footprints/templates

### Output
- Points: YAML, JSON, demo SVG
- Outlines: DXF, SVG
- Cases: JSCAD
- PCBs: `.kicad_pcb` (unrouted, no schematic/project file)

---

## 10. CLI Usage

```bash
npm install -g ergogen
ergogen input.yaml -o output_folder
ergogen .                      # when using external footprints in ./footprints/
```

For development:
```bash
git clone https://github.com/ergogen/ergogen.git
cd ergogen && npm install
node src/cli.js input.yaml -o output
```

---

## 11. Next Steps

- Search the [`#ergogen` GitHub topic](https://github.com/topics/ergogen) for real configs
- Read the [FlatFootFox v4 tutorial series](https://flatfootfox.com/ergogen-introduction/)
- Watch [Ben Vallack's Ergogen video](https://www.youtube.com/watch?v=UKfeJrRIcxw)
- Join [Discord](http://discord.ergogen.xyz)
