# Stack-chan LiDAR assets

- `assemble.py`: builds `public/stackchan-lidar/stackchan.glb` in Blender 4.5 from M5Stack's
  models (github.com/m5stack/M5_Hardware, MIT: `K151_StackChan/Structures/*.stl`,
  `K128_CoreS3/Structures/CoreS3.stl`, `U172_Unit_ToF4M/Structures/Unit_ToF4M.stl`) placed in
  `$LIDAR_WORK/m5/`, plus `face.png` (Stack-chan's face, 640 x 480). The parts in those files are
  laid out apart, so the script places them by their bounds, and adds the screen, the Grove
  sockets, the bracket and the cables. Nodes `yaw`, `pitch`, `sensor`, `tof0..3`.
  `LIDAR_WORK=dir blender -b --python assemble.py -- glb`, then
  `npx gltfpack -i stackchan-raw.glb -o stackchan.glb -cc -kn -km`.
- `pack_scan.py`: the scan `.ply` to `public/stackchan-lidar/scan.bin`.
