// The PCB outline in the assembly frame, in millimetres. KiCad's board-area
// layer exports cover `layerSize` around the same centre, so textures baked
// from them map straight onto the board faces by x and y.
export const board = {
  center: [0.1729, -0.2611],
  size: [25.3, 54.97],
  layerSize: [25.2984, 54.9656],
};
// The V3 case pocket holds the board's back face on a ledge at z = -0.30 mm in
// the case frame, with 0.3 mm clearance around the outline.
export const shellOffset = [0.2225, 2.7544, -2.5709];
