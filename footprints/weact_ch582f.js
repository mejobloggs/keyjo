module.exports = {
  params: {
    designator: 'MCU',
    side: 'F'
  },
  body: p => {
    const pinSpacing = 2.54;
    const rowSpacing = 15.24;
    const boardWidth = 38.5;
    const pinOffsetX = 5;

    const topPins = ['G', '5V', 'G', '3V3', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'A5', 'A4'];
    const bottomPins = ['A8', 'A9', 'B15', 'B14', 'B13', 'B12', 'B11', 'B10', 'B7', 'B4', 'BOOT', 'RST'];

    let pads = '';
    topPins.forEach((name, i) => {
      const x = pinOffsetX + i * pinSpacing;
      const y = -rowSpacing / 2;
      pads += `(pad "${name}" thru_hole circle (at ${x} ${y}) (size 1.7 1.7) (drill 1.0) (layers *.Cu *.Mask))\n`;
    });
    bottomPins.forEach((name, i) => {
      const x = pinOffsetX + i * pinSpacing;
      const y = rowSpacing / 2;
      pads += `(pad "${name}" thru_hole circle (at ${x} ${y}) (size 1.7 1.7) (drill 1.0) (layers *.Cu *.Mask))\n`;
    });

    return `
      (module WeAct_CH582F (layer F.Cu) (tedit 0)
      ${p.at}

      (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1 1) (thickness 0.15))))
      (fp_text value "WeAct_CH582F" (at 0 0) (layer F.SilkS) hide (effects (font (size 1 1) (thickness 0.15))))

      (fp_line (start -1 -9) (end -1 9) (layer F.SilkS) (width 0.12))
      (fp_line (start -1 9) (end ${boardWidth + 1} 9) (layer F.SilkS) (width 0.12))
      (fp_line (start ${boardWidth + 1} -9) (end -1 -9) (layer F.SilkS) (width 0.12))
      (fp_line (start ${boardWidth + 1} 9) (end ${boardWidth + 1} -9) (layer F.SilkS) (width 0.12))

      (fp_line (start 0 -8) (end 0 8) (layer F.CrtYd) (width 0.05))
      (fp_line (start 0 8) (end ${boardWidth} 8) (layer F.CrtYd) (width 0.05))
      (fp_line (start ${boardWidth} -8) (end 0 -8) (layer F.CrtYd) (width 0.05))
      (fp_line (start ${boardWidth} 8) (end ${boardWidth} -8) (layer F.CrtYd) (width 0.05))

      ${pads}
      )
    `
  }
}
