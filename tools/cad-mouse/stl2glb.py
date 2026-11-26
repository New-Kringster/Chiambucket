"""Four STLs exported from the public Onshape document "Brolocator case" -> one GLB.
Welds vertices, bakes 30 degree creased normals, seats the lid and its button cap
on the base (they are modelled 22 mm above it), and centres the case. Units stay mm."""
import struct, json, math, sys
SRC = sys.argv[1]; OUT = sys.argv[2]
PARTS = [('lid', 'Part 3', -22.0), ('button', 'Part 4', -22.0), ('base', 'Part 2', 0.0), ('pcb', 'Brolocator_PCB', 0.0)]
CENTRE = (0.0, 2.95, -3.75)
COS = math.cos(math.radians(30))

def load(name, dz):
    b = open(f'{SRC}/Assembly 1 - {name}.stl', 'rb').read(); n = struct.unpack('<I', b[80:84])[0]
    pos = {}; P = []; tris = []
    for i in range(n):
        v = struct.unpack_from('<9f', b, 84 + i * 50 + 12); t = []
        for k in range(3):
            p = (v[k*3] - CENTRE[0], v[k*3+1] - CENTRE[1], v[k*3+2] + dz - CENTRE[2])
            key = (round(p[0], 3), round(p[1], 3), round(p[2], 3))
            j = pos.get(key)
            if j is None: j = pos[key] = len(P); P.append(p)
            t.append(j)
        if len(set(t)) == 3: tris.append(t)
    return P, tris

def build(P, tris):
    fn = []; inc = [[] for _ in P]
    for f, (a, b, c) in enumerate(tris):
        A, B, C = P[a], P[b], P[c]
        u = [B[k]-A[k] for k in range(3)]; w = [C[k]-A[k] for k in range(3)]
        n = (u[1]*w[2]-u[2]*w[1], u[2]*w[0]-u[0]*w[2], u[0]*w[1]-u[1]*w[0])
        l = math.sqrt(n[0]**2 + n[1]**2 + n[2]**2) or 1e-12
        fn.append((n[0]/l, n[1]/l, n[2]/l, l))
        for j in (a, b, c): inc[j].append(f)
    verts = {}; VP = []; VN = []; idx = []
    for f, t in enumerate(tris):
        n0 = fn[f]
        for j in t:
            sx = sy = sz = 0.0
            for g in inc[j]:
                n1 = fn[g]
                if n0[0]*n1[0] + n0[1]*n1[1] + n0[2]*n1[2] >= COS:
                    sx += n1[0]*n1[3]; sy += n1[1]*n1[3]; sz += n1[2]*n1[3]
            l = math.sqrt(sx*sx + sy*sy + sz*sz) or 1.0
            n = (sx/l, sy/l, sz/l)
            key = (j, round(n[0], 2), round(n[1], 2), round(n[2], 2))
            k = verts.get(key)
            if k is None: k = verts[key] = len(VP); VP.append(P[j]); VN.append(n)
            idx.append(k)
    return VP, VN, idx

buf = bytearray(); views = []; accs = []; meshes = []; nodes = []
def add(data, target, comp, typ, count, mn=None, mx=None):
    while len(buf) % 4: buf.append(0)
    views.append({'buffer': 0, 'byteOffset': len(buf), 'byteLength': len(data), 'target': target}); buf.extend(data)
    a = {'bufferView': len(views)-1, 'componentType': comp, 'count': count, 'type': typ}
    if mn: a['min'] = mn; a['max'] = mx
    accs.append(a); return len(accs)-1
for name, src, dz in PARTS:
    VP, VN, idx = build(*load(src, dz))
    mn = [min(p[k] for p in VP) for k in range(3)]; mx = [max(p[k] for p in VP) for k in range(3)]
    pa = add(struct.pack(f'<{len(VP)*3}f', *[c for p in VP for c in p]), 34962, 5126, 'VEC3', len(VP), mn, mx)
    na = add(struct.pack(f'<{len(VN)*3}f', *[c for p in VN for c in p]), 34962, 5126, 'VEC3', len(VN))
    ia = add(struct.pack(f'<{len(idx)}I', *idx), 34963, 5125, 'SCALAR', len(idx))
    meshes.append({'name': name, 'primitives': [{'attributes': {'POSITION': pa, 'NORMAL': na}, 'indices': ia, 'material': len(meshes)}]})
    nodes.append({'name': name, 'mesh': len(meshes)-1})
    print(name, len(VP), 'verts', len(idx)//3, 'tris', [round(x, 1) for x in mn], [round(x, 1) for x in mx])
g = {'asset': {'version': '2.0', 'generator': 'stl2glb'}, 'scene': 0, 'scenes': [{'nodes': list(range(len(nodes)))}], 'nodes': nodes, 'meshes': meshes,
     'materials': [{'name': n, 'pbrMetallicRoughness': {'baseColorFactor': c, 'metallicFactor': 0, 'roughnessFactor': 0.6}} for n, c in
                   [('lid', [0.94, 0.54, 0.11, 1]), ('button', [0.75, 0.76, 0.78, 1]), ('base', [0.73, 0.83, 0.89, 1]), ('pcb', [0.25, 0.45, 0.36, 1])]],
     'accessors': accs, 'bufferViews': views, 'buffers': [{'byteLength': len(buf)}]}
j = json.dumps(g, separators=(',', ':')).encode(); j += b' ' * (-len(j) % 4)
while len(buf) % 4: buf.append(0)
open(OUT, 'wb').write(struct.pack('<4sII', b'glTF', 2, 28 + len(j) + len(buf)) + struct.pack('<I4s', len(j), b'JSON') + j + struct.pack('<I4s', len(buf), b'BIN\0') + bytes(buf))
