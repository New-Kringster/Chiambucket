"""Pack a Stack-chan LiDAR .ply (ascii, x y z r g b; x forward, y left, z up, metres)
into public/stackchan-lidar/scan.bin for app/stackchan-lidar/lidarScene.ts:
u32 count, then int16 x/y/z in mm in three.js axes (+X right, +Y up, +Z forward),
then u8 r/g/b, sorted for the article's sweep: 4 degree columns from left to right, the points of
each column in a fixed random order, so the cloud fills in as the head pans steadily across.
Usage: python3 pack_scan.py scan.ply out.bin   (needs numpy)"""
import sys
import numpy as np

src, out = sys.argv[1], sys.argv[2]
with open(src) as f:
    head = 0
    for line in f:
        head += 1
        if line.strip() == 'end_header':
            break
d = np.loadtxt(src, skiprows=head)
x, y, z = d[:, 0], d[:, 1], d[:, 2]
rgb = d[:, 3:6].astype(np.uint8)
X, Y, Z = -y, z, x
az = np.degrees(np.arctan2(X, Z))
el = np.degrees(np.arctan2(Y, np.hypot(X, Z)))
col = np.floor((az - az.min()) / 4.0).astype(int)
rnd = np.random.default_rng(9).random(len(az))
order = np.lexsort((rnd, col))
P = np.round(np.stack([X, Y, Z], 1)[order] * 1000).astype('<i2')
with open(out, 'wb') as f:
    f.write(np.array([len(P)], dtype='<u4').tobytes()); f.write(P.tobytes()); f.write(rgb[order].tobytes())
print(len(P), 'points')
