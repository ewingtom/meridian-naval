"""
CIC / bridge watch console — the closest-viewed geometry in the game (seen in
first-person from the seated bridge stations in src/ship/BridgeInterior.js).

SOURCE OF TRUTH for public/assets/models/bridge_console.glb (+ src mirror).
Never hand-edit the .glb; change this and re-run:

  /Applications/Blender.app/Contents/MacOS/Blender --background \
    --python scripts/blender/build_bridge_console.py

AXIS / PLACEMENT CONTRACT (probed from the previous export + BridgeInterior.js):
  - Authored Y-up, front/operator side = -Z, back = +Z, floor at Y 0, centred X 0.
  - Overall bbox MUST stay X -1.2..1.2 (width 2.40 m == CONSOLE_AUTHORED_WIDTH in
    BridgeInterior.js, which uniform-scales the model by width/2.4 per station),
    Y 0..~1.6, Z ~-1.47..0. The loader applies NO rotation, so the whole
    hierarchy is rotated +90deg about X before a Y-up glTF export, which (as in
    build_merchant_ship.py) makes authored coords land 1:1 in glTF space.
  - The operator sits on the -Z side looking toward +Z (toward the bow / forward
    windows); the raked instrument face + screens therefore face -Z and up so
    they read from the seat.
  - The glowing screen material MUST be named exactly 'Console_Screen_Mat' — the
    loader looks that name up and swaps in a per-station emissive colour
    (helm cyan / weapons amber / sonar green), double-sided.

Real PBR via flat Principled materials (matches the interior's MeshStandard look)
plus heavy relief geometry: recessed bezelled displays, grouped switch banks and
rotary knobs, a keyboard tray, a padded elbow/grab rail, cable runs, panel seams
and a knee-hole footwell.
"""
from __future__ import annotations

import math
from pathlib import Path

import bmesh
import bpy

ROOT = Path("/Users/tje/games/warship")
OUT = ROOT / "public/assets/models/bridge_console.glb"
OUT_MIRROR = ROOT / "src/assets/models/bridge_console.glb"

# ---- clean slate ----------------------------------------------------------
bpy.ops.wm.read_factory_settings(use_empty=True)
for obj in list(bpy.data.objects):
    bpy.data.objects.remove(obj, do_unlink=True)
for me in list(bpy.data.meshes):
    bpy.data.meshes.remove(me)
for ma in list(bpy.data.materials):
    bpy.data.materials.remove(ma)
scene = bpy.context.scene


def srgb_to_linear(c):
    return tuple(((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c)


def hexc(s):
    s = s.lstrip("#")
    return srgb_to_linear(tuple(int(s[i:i + 2], 16) / 255.0 for i in (0, 2, 4)))


def mat(name, color, rough=0.55, metal=0.1, emit=None, estr=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1.0)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if emit is not None:
        b.inputs["Emission Color"].default_value = (*emit, 1.0)
        b.inputs["Emission Strength"].default_value = estr
    return m


# Materials -----------------------------------------------------------------
M_FACE = mat("Console_Face_Mat", hexc("2f353c"), rough=0.62, metal=0.18)      # matte console face
M_FRAME = mat("Console_Frame_Mat", hexc("6d757c"), rough=0.38, metal=0.85)    # brushed metal frame
M_DARKFRAME = mat("Console_DarkFrame_Mat", hexc("22262b"), rough=0.44, metal=0.72)
M_BEZEL = mat("Console_Bezel_Mat", hexc("111417"), rough=0.72, metal=0.10)    # rubber screen bezel
M_SCREEN = mat("Console_Screen_Mat", hexc("0a2a33"), rough=0.12, metal=0.0,   # glossy glass (loader recolours)
               emit=hexc("2ad4f0"), estr=0.8)
M_KNOB = mat("Console_Knob_Mat", hexc("3c4248"), rough=0.34, metal=0.80)
M_KNOBCAP = mat("Console_KnobCap_Mat", hexc("15181b"), rough=0.5, metal=0.2)
M_KEY = mat("Console_Key_Mat", hexc("1b1e22"), rough=0.6, metal=0.05)
M_KEYTRAY = mat("Console_KeyTray_Mat", hexc("26292d"), rough=0.5, metal=0.35)
M_RAIL = mat("Console_Rail_Mat", hexc("141618"), rough=0.85, metal=0.02)      # padded grab rail
M_CABLE = mat("Console_Cable_Mat", hexc("101214"), rough=0.8, metal=0.1)
M_LED_A = mat("Console_LedA_Mat", hexc("101010"), rough=0.4, metal=0.1, emit=hexc("ffb02e"), estr=2.2)
M_LED_G = mat("Console_LedG_Mat", hexc("101010"), rough=0.4, metal=0.1, emit=hexc("3dffa0"), estr=2.2)
M_LED_R = mat("Console_LedR_Mat", hexc("101010"), rough=0.4, metal=0.1, emit=hexc("ff4438"), estr=2.0)
M_SWITCH = mat("Console_Switch_Mat", hexc("54585c"), rough=0.42, metal=0.7)
M_PLATE = mat("Console_Plate_Mat", hexc("3a4046"), rough=0.55, metal=0.4)


# ---- mesh helpers ---------------------------------------------------------
def link(obj):
    scene.collection.objects.link(obj)
    return obj


def bevel(obj, width, segments=2, angle=42):
    if width <= 0:
        return
    mod = obj.modifiers.new("Bevel", "BEVEL")
    mod.width = width
    mod.segments = segments
    mod.limit_method = "ANGLE"
    mod.angle_limit = math.radians(angle)
    bpy.context.view_layer.objects.active = obj
    try:
        bpy.ops.object.modifier_apply(modifier=mod.name)
    except Exception:
        pass


def shade_smooth(obj, angle=30):
    bpy.ops.object.select_all(action="DESELECT")
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    try:
        bpy.ops.object.shade_smooth_by_angle(angle=math.radians(angle))
    except Exception:
        try:
            bpy.ops.object.shade_smooth(use_auto_smooth=True, angle=math.radians(angle))
        except Exception:
            bpy.ops.object.shade_smooth()
    obj.select_set(False)


def box(name, loc, dim, m, bevel_w=0.012, rot=None, smooth=True, seg=2):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.active_object
    o.name = name
    o.scale = dim
    if rot:
        o.rotation_euler = rot
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    o.data.materials.append(m)
    bevel(o, bevel_w, seg)
    if smooth:
        shade_smooth(o)
    return o


def cyl(name, loc, radius, depth, m, axis="Y", verts=16, rot_extra=0.0, bevel_w=0.006):
    rot = {"Y": (math.radians(90), 0, 0), "Z": (0, 0, 0), "X": (0, math.radians(90), 0)}[axis]
    bpy.ops.mesh.primitive_cylinder_add(radius=radius, depth=depth, location=loc, vertices=verts)
    o = bpy.context.active_object
    o.name = name
    o.rotation_euler = (rot[0], rot[1], rot[2] + rot_extra)
    bpy.ops.object.transform_apply(rotation=True)
    o.data.materials.append(m)
    bevel(o, bevel_w, 1)
    shade_smooth(o, 44)
    return o


# ==========================================================================
# GEOMETRY.  Z: -1.47 (operator / screen face) .. 0 (back).  Y up. X beam.
# ==========================================================================
parts = []

WIDTH = 2.40
HW = WIDTH / 2.0            # 1.20
PED_TOP = 1.02             # top of the lower cabinet / desk height
KB_Y = 0.755               # keyboard tray surface height

# ---- lower cabinet: two side pedestals + a recessed centre (knee-hole) ----
for sx, tag in ((-1, "P"), (1, "S")):
    parts.append(box(f"Pedestal_{tag}", (sx * 0.82, PED_TOP / 2, -0.52),
                     (0.72, PED_TOP, 1.02), M_FACE, bevel_w=0.02))
    # kick plate recess strip along the floor of each pedestal front
    parts.append(box(f"Kick_{tag}", (sx * 0.82, 0.06, -1.01),
                     (0.66, 0.12, 0.06), M_DARKFRAME, bevel_w=0.004, smooth=False))
    # a vertical seam / access-panel line on the pedestal side
    parts.append(box(f"PedSeam_{tag}", (sx * 1.18, 0.5, -0.52),
                     (0.02, 0.9, 0.9), M_DARKFRAME, bevel_w=0.003, smooth=False))
    # recessed access panel with two captive screws on the pedestal front
    parts.append(box(f"AccessPanel_{tag}", (sx * 0.82, 0.42, -1.005),
                     (0.5, 0.62, 0.02), M_PLATE, bevel_w=0.006, smooth=False))
    for oy in (0.18, -0.18):
        parts.append(cyl(f"PanelScrew_{tag}_{oy}", (sx * 0.82, 0.42 + oy, -1.02),
                         0.02, 0.02, M_FRAME, axis="Z", verts=8, bevel_w=0))

# recessed centre back wall (creates the knee hole between the pedestals)
parts.append(box("CentreBack", (0, PED_TOP / 2, -0.16),
                 (1.28, PED_TOP, 0.30), M_FACE, bevel_w=0.02))
# toe-kick under the centre so the footwell has a floor lip, set back
parts.append(box("CentreToe", (0, 0.05, -0.38),
                 (1.28, 0.10, 0.22), M_DARKFRAME, bevel_w=0.004, smooth=False))

# ---- desk top slab spanning the pedestals --------------------------------
parts.append(box("DeskTop", (0, PED_TOP + 0.02, -0.52),
                 (WIDTH, 0.06, 1.04), M_FACE, bevel_w=0.014))

# ---- keyboard tray, protruding toward the operator over the knee hole ----
parts.append(box("KbTrayBed", (0, KB_Y - 0.03, -1.14),
                 (1.5, 0.05, 0.42), M_KEYTRAY, bevel_w=0.01))
# tray side cheeks + a front lip
parts.append(box("KbTrayLip", (0, KB_Y - 0.005, -1.345),
                 (1.5, 0.05, 0.03), M_DARKFRAME, bevel_w=0.006, smooth=False))
# keyboard: recessed key grid (low-relief individual keycaps)
KB_COLS, KB_ROWS = 15, 4
for r in range(KB_ROWS):
    for cc in range(KB_COLS):
        kx = (cc - (KB_COLS - 1) / 2) * 0.088
        kz = -1.05 - r * 0.058
        parts.append(box(f"Key_{r}_{cc}", (kx, KB_Y + 0.012, kz),
                         (0.072, 0.02, 0.046), M_KEY, bevel_w=0.004, smooth=False))
# a small trackball to one side of the keyboard
parts.append(cyl("TrackballRing", (0.78, KB_Y + 0.01, -1.16), 0.075, 0.03, M_DARKFRAME,
                 axis="Y", verts=18, bevel_w=0.004))
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.055, location=(0.78, KB_Y + 0.03, -1.16), segments=16, ring_count=8)
tb = bpy.context.active_object
tb.name = "Trackball"
tb.data.materials.append(M_KNOBCAP)
shade_smooth(tb, 45)
parts.append(tb)

# padded elbow rest strip along the near edge of the desk
parts.append(box("ElbowRest", (0, PED_TOP + 0.06, -0.99),
                 (WIDTH - 0.06, 0.06, 0.14), M_RAIL, bevel_w=0.028, seg=3))

# ==========================================================================
# RAKED INSTRUMENT STACK (rises from the back of the desk toward the operator)
# ==========================================================================
# lower sloped control panel: switch banks + rotary knobs, gentle rake
LP_RAKE = math.radians(58)          # measured from horizontal
lp_y, lp_z = PED_TOP + 0.20, -0.30
parts.append(box("LowerPanel", (0, lp_y, lp_z),
                 (WIDTH - 0.02, 0.30, 0.05), M_FACE, bevel_w=0.012,
                 rot=(math.radians(90) - LP_RAKE, 0, 0)))
# panel-normal helpers so switches/knobs sit proud of the raked surface
lp_n = (0.0, math.sin(LP_RAKE), -math.cos(LP_RAKE))   # outward face normal (up & toward -Z)


def on_lower(u, v):
    """u across width (m), v up the panel from its centre (m) -> world point on
    the lower panel's outer face."""
    up = (0.0, math.cos(LP_RAKE), math.sin(LP_RAKE))   # along-panel 'up' direction
    return (u,
            lp_y + up[1] * v + lp_n[1] * 0.03,
            lp_z + up[2] * v + lp_n[2] * 0.03)


# grouped switch banks (three clusters) — distinct rectangular guarded toggles
sw_rot = (math.radians(90) - LP_RAKE, 0, 0)
for gi, gx in enumerate((-0.86, -0.52)):        # left cluster: toggle bank
    for j in range(4):
        p = on_lower(gx, 0.06 - j * 0.0)         # placeholder, override z below
        p = on_lower(gx + (j - 1.5) * 0.055, 0.04)
        parts.append(box(f"Toggle_{gi}_{j}", p, (0.03, 0.05, 0.028), M_SWITCH,
                         bevel_w=0.004, rot=sw_rot, smooth=False))
# guard bar over the left toggle bank
gp = on_lower(-0.69, 0.09)
parts.append(box("ToggleGuard", gp, (0.34, 0.02, 0.05), M_FRAME, bevel_w=0.004,
                 rot=sw_rot, smooth=False))

# rotary knobs cluster (centre-left) — three sizes, clearly distinct from switches
for j, (kx, kr) in enumerate(((-0.16, 0.062), (0.02, 0.05), (0.18, 0.05))):
    p = on_lower(kx, 0.0)
    parts.append(cyl(f"KnobBase_{j}", p, kr, 0.05, M_KNOB, axis="Y",
                     verts=18, rot_extra=0, bevel_w=0.004))
    # tilt the knob to sit flush on the raked panel
    kb_ = parts[-1]
    kb_.rotation_euler = (LP_RAKE - math.radians(90), 0, 0)
    bpy.ops.object.transform_apply(rotation=True)
    p2 = on_lower(kx, 0.0)
    p2 = (p2[0], p2[1] + lp_n[1] * 0.02, p2[2] + lp_n[2] * 0.02)
    cap = cyl(f"KnobCap_{j}", p2, kr * 0.5, 0.04, M_KNOBCAP, axis="Y", verts=14, bevel_w=0.003)
    cap.rotation_euler = (LP_RAKE - math.radians(90), 0, 0)
    bpy.ops.object.transform_apply(rotation=True)
    # pointer notch on the knob
    parts.append(cap)
# right cluster: illuminated push-buttons in a 3x3 grid with LED tell-tales
for rr in range(3):
    for ccc in range(3):
        bx = 0.58 + (ccc - 1) * 0.075
        p = on_lower(bx, 0.07 - rr * 0.07)
        led = (M_LED_G, M_LED_A, M_LED_R)[(rr + ccc) % 3]
        parts.append(box(f"PBtn_{rr}_{ccc}", p, (0.055, 0.045, 0.022), M_KEYTRAY,
                         bevel_w=0.004, rot=sw_rot, smooth=False))
        pl = (p[0], p[1] + lp_n[1] * 0.014, p[2] + lp_n[2] * 0.014)
        parts.append(box(f"PBtnLed_{rr}_{ccc}", pl, (0.03, 0.03, 0.006), led,
                         bevel_w=0, rot=sw_rot, smooth=False))

# ---- main display bezel: three recessed screens, steep rake --------------
MP_RAKE = math.radians(74)          # nearly upright, tilted toward operator
mp_y, mp_z = PED_TOP + 0.44, -0.12
mp_rot = (math.radians(90) - MP_RAKE, 0, 0)
mp_n = (0.0, math.sin(MP_RAKE), -math.cos(MP_RAKE))
mp_up = (0.0, math.cos(MP_RAKE), math.sin(MP_RAKE))


def on_main(u, v, out=0.0):
    return (u,
            mp_y + mp_up[1] * v + mp_n[1] * out,
            mp_z + mp_up[2] * v + mp_n[2] * out)


# backing panel for the whole display head (thin, front face at out ~0.022)
parts.append(box("DisplayHead", (0, mp_y, mp_z), (WIDTH, 0.62, 0.044), M_FACE,
                 bevel_w=0.014, rot=mp_rot))


def make_screen(tag, su, sv, sw, sh):
    """A framed, glossy emissive display mounted proud of the raked head so the
    solid backing panel never occludes it: 4 bezel bars form a picture-frame
    around a slightly-recessed screen, capped by a thin brushed-metal trim."""
    scr_out, bez_out, trim_out = 0.030, 0.044, 0.050
    bw = 0.028   # bezel bar width
    # glossy emissive screen face (the visible, lit surface)
    parts.append(box(f"Screen_{tag}", on_main(su, sv, scr_out),
                     (sw, sh, 0.010), M_SCREEN, bevel_w=0.002, rot=mp_rot, smooth=False))
    # bezel frame: top/bottom/left/right bars (proud of the screen)
    parts.append(box(f"Bez_{tag}_T", on_main(su, sv + sh / 2 + bw / 2, bez_out),
                     (sw + 2 * bw, bw, 0.028), M_BEZEL, bevel_w=0.005, rot=mp_rot, smooth=False))
    parts.append(box(f"Bez_{tag}_B", on_main(su, sv - sh / 2 - bw / 2, bez_out),
                     (sw + 2 * bw, bw, 0.028), M_BEZEL, bevel_w=0.005, rot=mp_rot, smooth=False))
    parts.append(box(f"Bez_{tag}_L", on_main(su - sw / 2 - bw / 2, sv, bez_out),
                     (bw, sh, 0.028), M_BEZEL, bevel_w=0.005, rot=mp_rot, smooth=False))
    parts.append(box(f"Bez_{tag}_R", on_main(su + sw / 2 + bw / 2, sv, bez_out),
                     (bw, sh, 0.028), M_BEZEL, bevel_w=0.005, rot=mp_rot, smooth=False))
    # thin brushed-metal trim outline (very shallow, just catches a highlight)
    for (ox, oy, dw, dh) in ((0, sh / 2 + bw, sw + 2 * bw + 0.01, 0.01),
                             (0, -sh / 2 - bw, sw + 2 * bw + 0.01, 0.01),
                             (-sw / 2 - bw, 0, 0.01, sh + 0.01),
                             (sw / 2 + bw, 0, 0.01, sh + 0.01)):
        parts.append(box(f"Trim_{tag}_{ox}_{oy}", on_main(su + ox, sv + oy, trim_out),
                         (dw, dh, 0.006), M_FRAME, bevel_w=0, rot=mp_rot, smooth=False))


# three displays: a wide centre one flanked by two portrait side screens
make_screen("L", -0.79, -0.01, 0.46, 0.40)
make_screen("C", 0.0, 0.01, 0.82, 0.46)
make_screen("R", 0.79, -0.01, 0.46, 0.40)

# soft-key strip beneath the centre screen (proud of the head)
for k in range(6):
    kx = (k - 2.5) * 0.13
    parts.append(box(f"SoftKey_{k}", on_main(kx, -0.26, 0.030),
                     (0.1, 0.05, 0.02), M_KEYTRAY, bevel_w=0.004, rot=mp_rot, smooth=False))

# a data-strip label plate above the centre screen with tell-tale LEDs
for k in range(8):
    kx = (k - 3.5) * 0.08
    parts.append(box(f"HeadLed_{k}", on_main(kx, 0.285, 0.032),
                     (0.03, 0.02, 0.01), (M_LED_G, M_LED_A)[k % 2], bevel_w=0, rot=mp_rot, smooth=False))

# ---- crown / top brow + padded grab rail ---------------------------------
brow_y = mp_y + mp_up[1] * 0.33 + 0.02
brow_z = mp_z + mp_up[2] * 0.33
parts.append(box("Brow", (0, brow_y, brow_z + 0.02), (WIDTH, 0.06, 0.20), M_DARKFRAME, bevel_w=0.012))
# padded grab / elbow rail across the brow, on two stanchions
rail_y = brow_y + 0.10
rail_z = brow_z - 0.14
parts.append(cyl("GrabRail", (0, rail_y, rail_z), 0.035, WIDTH - 0.12, M_RAIL,
                 axis="X", verts=16, bevel_w=0.01))
for sx in (-1, 1):
    parts.append(cyl(f"RailStanchion_{'S' if sx > 0 else 'P'}",
                     (sx * (HW - 0.14), brow_y + 0.05, rail_z + 0.03),
                     0.02, 0.14, M_FRAME, axis="Y", verts=10, bevel_w=0.004))

# ---- cable runs down the back (+Z) ---------------------------------------
for sx, off in ((-1, 0.0), (1, 0.0)):
    parts.append(cyl(f"CableTrunk_{'S' if sx > 0 else 'P'}",
                     (sx * 0.6, 0.5, 0.02), 0.05, 1.0, M_CABLE, axis="Y", verts=10, bevel_w=0.006))
parts.append(box("BackConnBox", (0, 0.34, 0.03), (0.7, 0.4, 0.08), M_DARKFRAME, bevel_w=0.008))
for k in range(5):
    parts.append(cyl(f"BackConn_{k}", (-0.28 + k * 0.14, 0.34, 0.09), 0.03, 0.06, M_KNOB,
                     axis="Z", verts=10, bevel_w=0.003))
# floor cable conduit exiting the base
parts.append(cyl("FloorConduit", (0.0, 0.06, 0.06), 0.06, 0.5, M_CABLE, axis="X", verts=10, bevel_w=0.006))


# ==========================================================================
# merge by material (151 parts would be 151 draw calls) — one mesh per material
# so each has a single material and the loader's per-name screen lookup works.
# ==========================================================================
groups = {}
for o in parts:
    if not o or o.type != "MESH" or not o.data.materials:
        continue
    groups.setdefault(o.data.materials[0].name, []).append(o)

merged = []
for mname, objs in groups.items():
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    if len(objs) > 1:
        try:
            bpy.ops.object.join()
        except Exception:
            pass
    obj = bpy.context.view_layer.objects.active
    obj.name = f"C_{mname}"
    merged.append(obj)
bpy.ops.object.select_all(action="DESELECT")

# ==========================================================================
# assemble, rotate to glTF convention, export
# ==========================================================================
bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 0, 0))
root = bpy.context.active_object
root.name = "BridgeConsole"
for o in merged:
    if o and o.parent is None:
        o.parent = root
root.rotation_euler = (math.radians(90), 0, 0)   # authored coords -> glTF 1:1

tris = 0
for o in scene.objects:
    if o.type == "MESH" and o.data:
        o.data.calc_loop_triangles()
        tris += len(o.data.loop_triangles)

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT_MIRROR.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=str(OUT), export_format="GLB", use_selection=False,
    export_apply=True, export_yup=True, export_materials="EXPORT",
)
import shutil
shutil.copyfile(OUT, OUT_MIRROR)
size_kb = OUT.stat().st_size / 1024
print(f"EXPORTED {OUT} tris={tris} size={size_kb:.1f}KB parts={len(parts)}")
