module.exports = {
  params: {
    designator: 'S',
    from: undefined,
    to: undefined,
    keycaps: false
  },
  body: p => {
    const standard = `
      (module Redragon_LowProfile (layer F.Cu) (tedit 0)
      ${p.at}

      (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1 1) (thickness 0.15))))
      (fp_text value "" (at 0 0) (layer F.SilkS) hide (effects (font (size 1 1) (thickness 0.15))))

      (fp_line (start -7.1 -7.1) (end -7.1 7.1) (layer F.SilkS) (width 0.12))
      (fp_line (start -7.1 7.1) (end 7.1 7.1) (layer F.SilkS) (width 0.12))
      (fp_line (start 7.1 -7.1) (end -7.1 -7.1) (layer F.SilkS) (width 0.12))
      (fp_line (start 7.1 7.1) (end 7.1 -7.1) (layer F.SilkS) (width 0.12))

      (fp_line (start -7.25 -7.25) (end -7.25 7.25) (layer F.CrtYd) (width 0.05))
      (fp_line (start -7.25 7.25) (end 7.25 7.25) (layer F.CrtYd) (width 0.05))
      (fp_line (start 7.25 -7.25) (end -7.25 -7.25) (layer F.CrtYd) (width 0.05))
      (fp_line (start 7.25 7.25) (end 7.25 -7.25) (layer F.CrtYd) (width 0.05))

      (pad "" np_thru_hole circle (at 0 0) (size 4.4 4.4) (drill 4.4) (layers *.Cu *.Mask))
      `

    const keycap = `
      (fp_line (start -9.525 -9.525) (end 9.525 -9.525) (layer Dwgs.User) (width 0.15))
      (fp_line (start 9.525 -9.525) (end 9.525 9.525) (layer Dwgs.User) (width 0.15))
      (fp_line (start 9.525 9.525) (end -9.525 9.525) (layer Dwgs.User) (width 0.15))
      (fp_line (start -9.525 9.525) (end -9.525 -9.525) (layer Dwgs.User) (width 0.15))
      `

    return `
      ${standard}
      ${p.keycaps ? keycap : ''}
      (pad 1 thru_hole circle (at ${p.isxy(3.8, 3.8).x} ${p.isxy(3.8, 3.8).y}) (size 2.2 2.2) (drill 1.2) (layers *.Cu *.Mask) ${p.from})
      (pad 2 thru_hole circle (at ${p.isxy(0, 6.5).x} ${p.isxy(0, 6.5).y}) (size 2.2 2.2) (drill 1.2) (layers *.Cu *.Mask) ${p.to})
      )
    `
  }
}
