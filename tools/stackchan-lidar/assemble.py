# Assemble Stack-chan with four Unit ToF4M from M5Stack's own models
# (M5_Hardware, MIT). Units: mm while building, scaled to metres on export.
# Axes: x right, y back (front = -y), z up. Hierarchy: base -> yaw -> pitch.
import bpy, mathutils, math, sys, os
from mathutils import Vector

import os
L = os.environ.get('LIDAR_WORK', os.path.dirname(os.path.abspath(__file__)))  # holds m5/ (the STLs) and face.png
M5 = L + '/m5/'
MODE = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else 'check'

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene

def mat(name, rgb, rough=0.55, metal=0.0, emit=None):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*rgb, 1); b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    if emit is not None:
        b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = 1.0
    return m

def srgb(h):
    h = h.lstrip('#'); c = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)

M_BODY = mat('body', srgb('#d8d8d4'), 0.5)
M_BASE = mat('base', srgb('#36383b'), 0.62)
M_FACE = mat('glass', srgb('#050506'), 0.32)
M_TOF = mat('tof', srgb('#ece5d6'), 0.55)
M_RED = mat('grove', srgb('#9b1b2a'), 0.45)
M_SENS = mat('sensor', srgb('#0a0a0a'), 0.2)
M_LENS = mat('lens', srgb('#c8a64a'), 0.3, 0.6)
M_BRK = mat('bracket', srgb('#1c1d20'), 0.6)
WIRE = {'k': mat('w_k', srgb('#151515'), 0.5), 'r': mat('w_r', srgb('#c0212a'), 0.5),
        'y': mat('w_y', srgb('#e3b51e'), 0.5), 'w': mat('w_w', srgb('#eeeeea'), 0.5)}

def load(name, keep=None):
    bpy.ops.wm.stl_import(filepath=M5 + name + '.stl')
    o = bpy.context.selected_objects[0]
    if keep:
        bpy.context.view_layer.objects.active = o
        bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.separate(type='LOOSE'); bpy.ops.object.mode_set(mode='OBJECT')
        parts = [p for p in bpy.context.selected_objects]
        good = [p for p in parts if keep(bbox(p))]
        for p in parts:
            if p not in good: bpy.data.objects.remove(p)
        bpy.ops.object.select_all(action='DESELECT')
        for p in good: p.select_set(True)
        bpy.context.view_layer.objects.active = good[0]
        if len(good) > 1: bpy.ops.object.join()
        o = bpy.context.view_layer.objects.active
    o.name = name
    return o

def bbox(o):
    vs = [o.matrix_world @ v.co for v in o.data.vertices]
    return Vector([min(v[i] for v in vs) for i in range(3)]), Vector([max(v[i] for v in vs) for i in range(3)])

def move(objs, d):
    for o in objs: o.location += d
    bpy.context.view_layer.update()

def setmat(o, m):
    o.data.materials.clear(); o.data.materials.append(m)

def box(name, size, loc, m, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc); o = bpy.context.active_object
    o.name = name; o.scale = size; bpy.ops.object.transform_apply(scale=True)
    if bevel:
        bv = o.modifiers.new('bv', 'BEVEL'); bv.width = bevel; bv.segments = 3
        bpy.ops.object.modifier_apply(modifier='bv')
    setmat(o, m); return o

# ── base ──
base = load('StackChan-Base'); setmat(base, M_BASE)
mn, mx = bbox(base); move([base], Vector((-(mn.x + mx.x) / 2, -(mn.y + mx.y) / 2, -mn.z)))
BASE_TOP = bbox(base)[1].z

# ── body (yaw): the servo body with its covers, which share one frame ──
body = load('StackChan-ServoBody'); cov = load('StackChan-ServoCover'); side = load('StackChan-ServoSideCover')
for o in (body, cov, side): setmat(o, M_BODY)
mn, mx = bbox(body)
move([body, cov, side], Vector((-(mn.x + mx.x) / 2, -(mn.y + mx.y) / 2, BASE_TOP - 1.5 - mn.z)))
BODY_TOP = bbox(body)[1].z

# ── head (pitch): the shell, the CoreS3 inside it, the face ──
shell = load('StackChan-MainBody'); setmat(shell, M_BODY)
mn, mx = bbox(shell)
move([shell], Vector((-(mn.x + mx.x) / 2, -(mn.y + mx.y) / 2 - 3, BODY_TOP + 1.0 - mn.z)))
smn, smx = bbox(shell)
HC = (smn + smx) / 2
core = load('CoreS3', keep=lambda b: abs((b[0].x + b[1].x) / 2) < 15 and (b[1].x - b[0].x) > 50)
setmat(core, M_BODY)
mn, mx = bbox(core)
move([core], Vector((-(mn.x + mx.x) / 2, smn.y + 0.6 - mn.y, HC.z - (mn.z + mx.z) / 2)))
FRONT = smn.y
# the CoreS3's glass front, its screen showing Stack-chan's face, and the camera
face = box('face', (53.2, 1.2, 53.2), (0, FRONT - 0.2, HC.z), M_FACE, bevel=2.5)
img = bpy.data.images.load(L + '/face.png')
mscr = bpy.data.materials.new('screen'); mscr.use_nodes = True
nt = mscr.node_tree; bs = nt.nodes['Principled BSDF']; tx = nt.nodes.new('ShaderNodeTexImage'); tx.image = img
nt.links.new(tx.outputs['Color'], bs.inputs['Base Color']); nt.links.new(tx.outputs['Color'], bs.inputs['Emission Color'])
bs.inputs['Emission Strength'].default_value = 1.6; bs.inputs['Roughness'].default_value = 0.15
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, FRONT - 0.85, HC.z + 3.2), rotation=(math.pi / 2, 0, 0))
scr = bpy.context.active_object; scr.name = 'screen'; scr.scale = (40.8, 30.6, 1); bpy.ops.object.transform_apply(scale=True)
setmat(scr, mscr)
bpy.ops.mesh.primitive_cylinder_add(radius=2.2, depth=0.6, location=(0, FRONT - 0.9, HC.z - 19.5), rotation=(math.pi / 2, 0, 0))
cam = bpy.context.active_object; cam.name = 'camring'; setmat(cam, M_RED)
bpy.ops.mesh.primitive_cylinder_add(radius=1.5, depth=0.8, location=(0, FRONT - 1.0, HC.z - 19.5), rotation=(math.pi / 2, 0, 0))
lens = bpy.context.active_object; lens.name = 'camlens'; setmat(lens, M_SENS)

# ── the array: four Unit ToF4M on a bracket on top of the head, facing forward ──
HEAD_TOP = smx.z
tof_src = load('Unit_ToF4M', keep=lambda b: abs((b[0].x + b[1].x) / 2) < 15)
setmat(tof_src, M_TOF)
mn, mx = bbox(tof_src)
move([tof_src], -(mn + mx) / 2)   # 24 (x) x 32 (y) x 8 (z), sensor on +z
# lay it so the sensor faces -y and its long side runs left-right
tof_src.rotation_euler = (math.pi / 2, math.pi / 2, 0)
bpy.ops.object.select_all(action='DESELECT'); tof_src.select_set(True); bpy.context.view_layer.objects.active = tof_src
bpy.ops.object.transform_apply(rotation=True)
tmn, tmx = bbox(tof_src); TW, TD, TH = tmx.x - tmn.x, tmx.y - tmn.y, tmx.z - tmn.z
print('TOF dims', TW, TD, TH)
GAP = 0.6
ARR_Y = FRONT + 9.0
units = []
for i, (cx, cz) in enumerate([(-1, 1), (1, 1), (-1, -1), (1, -1)]):
    u = tof_src.copy(); u.data = tof_src.data.copy(); sc.collection.objects.link(u)
    if cx > 0: u.rotation_euler = (0, math.pi, 0)   # the right column mirrored so the sockets face out
    u.location = (cx * (TW / 2 + GAP / 2), ARR_Y, HEAD_TOP + 3 + TH + GAP / 2 + cz * (TH / 2 + GAP / 2))
    u.name = f'tof{i}'; units.append(u)
    bpy.context.view_layer.update()
    a, b = bbox(u); want = Vector(u.location)
    u.location += want - (a + b) / 2
bpy.data.objects.remove(tof_src)
bpy.context.view_layer.update()
ARR_MID_Z = HEAD_TOP + 3 + TH + GAP / 2
# the black bracket behind them, holding the PaHub
brk = box('bracket', (2 * TW + 4, 6, 2 * TH + 4), (0, ARR_Y + TD / 2 + 3, ARR_MID_Z), M_BRK, bevel=1.0)
foot = box('bracketfoot', (24, 18, 3.2), (0, ARR_Y + 8, HEAD_TOP + 1.4), M_BRK, bevel=0.8)
# red Grove sockets on the outer sides, and the sensor windows
sockets = []
for u in units:
    side_x = 1 if u.location.x > 0 else -1
    s = box('grove', (3.2, 7.2, 8.2), (u.location.x + side_x * (TW / 2 - 0.4), ARR_Y - 1.0, u.location.z), M_RED, bevel=0.4)
    sockets.append(s)
    w = box('window', (3.4, 0.6, 4.6), (u.location.x - side_x * 1.0, ARR_Y - TD / 2 - 0.05, u.location.z + 3.2), M_SENS, bevel=0.3)
    sockets.append(w)

# ── Grove cables: four strands each, from every socket down round the head's sides to the back ──
def cable(pts, name):
    objs = []
    for k, (key, off) in enumerate([('k', -1.5), ('r', -0.5), ('y', 0.5), ('w', 1.5)]):
        cd = bpy.data.curves.new(name + key, 'CURVE'); cd.dimensions = '3D'; cd.bevel_depth = 0.62; cd.bevel_resolution = 1; cd.resolution_u = 8
        sp = cd.splines.new('BEZIER'); sp.bezier_points.add(len(pts) - 1)
        for bp, p in zip(sp.bezier_points, pts):
            bp.co = Vector(p) + Vector((0, off * 1.2, 0)); bp.handle_left_type = bp.handle_right_type = 'AUTO'
        ob = bpy.data.objects.new(name + key, cd); sc.collection.objects.link(ob)
        ob.data.materials.append(WIRE[key]); objs.append(ob)
    return objs
cables = []
for i, u in enumerate(units):
    sx = 1 if u.location.x > 0 else -1
    x0 = u.location.x + sx * (TW / 2 + 2.5); z0 = u.location.z
    hw = (smx.x - smn.x) / 2
    pts = [(x0, ARR_Y - 1, z0), (x0 + sx * (10 + 5 * (i // 2)), ARR_Y + 4, z0 - 8),
           (sx * (hw + 12 + 4 * (i // 2)), FRONT + 18, HEAD_TOP - 30 - 6 * (i // 2)),
           (sx * (hw + 5), smx.y - 6, HC.z - 18), (sx * 10, smx.y + 4, HC.z - 6)]
    cables += cable(pts, f'cable{i}')
for c in cables:
    bpy.ops.object.select_all(action='DESELECT'); c.select_set(True); bpy.context.view_layer.objects.active = c
    bpy.ops.object.convert(target='MESH')
cables = [o for o in sc.objects if o.name.startswith('cable')]

# ── hierarchy and pivots ──
PITCH_PIVOT = Vector((0, HC.y, BODY_TOP + 6.0))
yaw = bpy.data.objects.new('yaw', None); sc.collection.objects.link(yaw); yaw.location = (0, 0, 0)
pitch = bpy.data.objects.new('pitch', None); sc.collection.objects.link(pitch); pitch.location = PITCH_PIVOT
pitch.parent = yaw
bpy.context.view_layer.update()
def parent(o, p):
    bpy.context.view_layer.update()
    o.parent = p; o.matrix_parent_inverse = p.matrix_world.inverted()
for o in (body, cov, side): parent(o, yaw)
for o in [shell, core, face, scr, cam, lens, brk, foot] + units + sockets + cables: parent(o, pitch)
anchor = bpy.data.objects.new('sensor', None); sc.collection.objects.link(anchor)
anchor.location = (0, ARR_Y - TD / 2 - 0.5, ARR_MID_Z); parent(anchor, pitch)
print('PIVOT', tuple(round(v, 2) for v in PITCH_PIVOT), 'SENSOR', tuple(round(v, 2) for v in anchor.location + pitch.location), 'TOP', round(bbox(units[0])[1].z, 1))

root = bpy.data.objects.new('stackchan', None); sc.collection.objects.link(root); bpy.context.view_layer.update()
for o in (base, yaw): parent(o, root)
root.scale = (0.001, 0.001, 0.001)

for o in sc.objects:
    if o.type == 'MESH':
        for p in o.data.polygons: p.use_smooth = False
        o.data.shade_auto_smooth(angle=math.radians(35)) if hasattr(o.data, 'shade_auto_smooth') else None

bpy.ops.wm.save_as_mainfile(filepath=L + '/stackchan.blend')

if MODE == 'glb':
    bpy.ops.export_scene.gltf(filepath=L + '/stackchan-raw.glb', export_format='GLB', use_selection=False,
                              export_apply=True, export_yup=True, export_materials='EXPORT', export_image_format='WEBP')
    print('EXPORTED')
