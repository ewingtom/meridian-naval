"""
MERIDIAN — Arleigh Burke Flight IIA destroyer (modern USN haze-grey).

SOURCE OF TRUTH for public/assets/models/player_ship.glb (and the src/ mirror).
Never hand-edit the .glb — change this and re-run:

  /Applications/Blender.app/Contents/MacOS/Blender --background \
    --python scripts/blender/build_arleigh_burke.py

Authored Y-up, bow = +Z, starboard = +X, waterline = Y 0.
The runtime (src/ship/CrewedShip.js `_tryLoadRealModel`) applies
rotation.x = -PI/2 and rotation.y = PI after the glTF Y-up remap to restore
bow=+Z / up=+Y, so DO NOT change the authoring axes without updating that.

Silhouette targets (Flight IIA, LOA 155.3 m / beam 20.4 m):
  Mk45 5"/62 on the forecastle -> 32-cell fwd VLS -> massive near-full-beam
  stepped deckhouse with four octagonal SPY-1D faces on canted corners ->
  bridge at ~20 m -> mast truck at ~45 m -> two faceted macks -> 64-cell aft
  VLS -> twin-helo hangar -> flight deck -> transom.

Mount points consumed by CrewedShip._extractMountPoints (keep these names):
  Helm, WeaponsStation, GunBarrelTip, MissileTube*, CIWS*
Helm / WeaponsStation are deliberately co-located with BridgeInterior.js's own
mount points (floorY 19.4, room X -8.3..9.6 / Z 5.5..23.5) because the GLB
empties win the merge in _tryLoadRealModel.
"""
from __future__ import annotations

import math
import shutil
import sys
from pathlib import Path

import bmesh
import bpy

_SCRIPT_DIR = str(Path(__file__).resolve().parent) if "__file__" in globals() \
    else "/Users/tje/games/warship/scripts/blender"
if _SCRIPT_DIR not in sys.path:
    sys.path.insert(0, _SCRIPT_DIR)
import warship_textures as wtex  # noqa: E402

ROOT = Path("/Users/tje/games/warship")
OUT = ROOT / "public/assets/models/player_ship.glb"
OUT_MIRROR = ROOT / "src/assets/models/player_ship.glb"

LOA, BEAM, DECK_Y = 155.0, 20.0, 6.0
HALF = LOA * 0.5

# Superstructure deck heights above the waterline (metres).
L01 = 9.7    # 01 level top
L02 = 13.4   # 02 level top
L03 = 19.0   # 03 level top == bridge deck (BridgeInterior floorY is 19.4)
L04 = 23.4   # pilothouse roof
WIN_LO, WIN_HI = 20.30, 22.05  # bridge window band (interior band is 20.35..21.95)

bpy.ops.wm.read_factory_settings(use_empty=True)
for obj in list(bpy.data.objects):
    bpy.data.objects.remove(obj, do_unlink=True)
for mesh in list(bpy.data.meshes):
    bpy.data.meshes.remove(mesh)
for mat in list(bpy.data.materials):
    bpy.data.materials.remove(mat)

scene = bpy.context.scene


# --------------------------------------------------------------------------
# helpers
# --------------------------------------------------------------------------
def srgb_to_linear(c):
    return tuple(((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c)


def hexc(s):
    s = s.lstrip("#")
    return srgb_to_linear(tuple(int(s[i:i + 2], 16) / 255.0 for i in (0, 2, 4)))


def new_mat(name, color, roughness=0.5, metallic=0.10):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    # Single-sided: the walk-in BridgeInterior lives *inside* the exterior bridge
    # block, and backface culling is what lets the player see out of it instead of
    # staring at the inside of an opaque box.
    mat.use_backface_culling = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    if "Metallic" in bsdf.inputs:
        bsdf.inputs["Metallic"].default_value = metallic
    return mat


def link(obj):
    scene.collection.objects.link(obj)
    return obj


def mesh_from_bmesh(name, bm):
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    return link(bpy.data.objects.new(name, mesh))


def bevel(obj, width=0.06, segments=2, angle=30):
    if width <= 0:
        return
    mod = obj.modifiers.new("Bevel", "BEVEL")
    mod.width = width
    mod.segments = segments
    mod.limit_method = "ANGLE"
    mod.angle_limit = math.radians(angle)
    mod.harden_normals = False
    bpy.context.view_layer.objects.active = obj
    try:
        bpy.ops.object.modifier_apply(modifier=mod.name)
    except Exception:
        pass


def shade_smooth(obj, angle=26):
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


def uv_cube(obj, size=8.0):
    """World-scale box projection — keeps the runtime haze texture at a constant
    physical size instead of stretching one 0..1 tile over a 60 m deckhouse."""
    if obj.type != "MESH":
        return
    bpy.ops.object.select_all(action="DESELECT")
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    try:
        bpy.ops.uv.cube_project(cube_size=size, correct_aspect=True)
    except Exception:
        pass
    bpy.ops.object.mode_set(mode="OBJECT")
    obj.select_set(False)


def uv_smart(obj, margin=0.01):
    if obj.type != "MESH":
        return
    bpy.ops.object.select_all(action="DESELECT")
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    try:
        bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=margin)
    except Exception:
        pass
    bpy.ops.object.mode_set(mode="OBJECT")
    obj.select_set(False)


def add_box(name, loc, dim, mat, bevel_w=0.05, rot=None, uv=8.0, smooth=True):
    """`dim` is the FULL size on each axis (the cube primitive is 1 m)."""
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = dim
    if rot:
        obj.rotation_euler = rot
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    bevel(obj, bevel_w, 2)
    if smooth:
        shade_smooth(obj)
    if uv:
        uv_cube(obj, uv)
    return obj


def add_cyl(name, loc, radius, depth, mat, rot=None, verts=16, bevel_w=0.03, smooth=True):
    bpy.ops.mesh.primitive_cylinder_add(radius=radius, depth=depth, location=loc, vertices=verts)
    obj = bpy.context.active_object
    obj.name = name
    if rot:
        obj.rotation_euler = rot
        bpy.ops.object.transform_apply(rotation=True)
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    bevel(obj, bevel_w, 1)
    if smooth:
        shade_smooth(obj, 40)
    return obj


def add_empty(name, loc):
    bpy.ops.object.empty_add(type="PLAIN_AXES", location=loc)
    e = bpy.context.active_object
    e.name = name
    e.empty_display_size = 0.6
    return e


def _shoelace(poly):
    a = 0.0
    n = len(poly)
    for i in range(n):
        x1, z1 = poly[i]
        x2, z2 = poly[(i + 1) % n]
        a += x1 * z2 - x2 * z1
    return a * 0.5


def ensure_ccw(poly):
    return list(poly) if _shoelace(poly) > 0 else list(poly)[::-1]


def _edge_normal(a, b):
    du, dv = b[0] - a[0], b[1] - a[1]
    L = math.hypot(du, dv) or 1e-9
    return (dv / L, -du / L)


def offset_polygon(poly, d):
    """Miter offset of a CCW (x,z) polygon. d > 0 pushes outward, d < 0 insets."""
    if abs(d) < 1e-6:
        return list(poly)
    n = len(poly)
    out = []
    for i in range(n):
        prev, cur, nxt = poly[i - 1], poly[i], poly[(i + 1) % n]
        n1 = _edge_normal(prev, cur)
        n2 = _edge_normal(cur, nxt)
        mx, mv = n1[0] + n2[0], n1[1] + n2[1]
        L = math.hypot(mx, mv)
        if L < 1e-6:
            out.append(cur)
            continue
        mx, mv = mx / L, mv / L
        cos_h = max(mx * n1[0] + mv * n1[1], 0.30)
        out.append((cur[0] + mx * d / cos_h, cur[1] + mv * d / cos_h))
    return out


def poly_prism(name, poly, y0, y1, mat, inset_top=0.0, inset_bot=0.0,
               bevel_w=0.12, cap_bottom=True, uv=9.0, smooth_angle=24):
    """Extrude an (x,z) plan polygon between two heights, insetting the top ring so
    the sides slope inboard — the RCS-style faceting a modern warship needs."""
    poly = ensure_ccw(poly)
    bot = offset_polygon(poly, -inset_bot)
    top = offset_polygon(poly, -inset_top)
    bm = bmesh.new()
    vb = [bm.verts.new((x, y0, z)) for (x, z) in bot]
    vt = [bm.verts.new((x, y1, z)) for (x, z) in top]
    n = len(poly)
    for i in range(n):
        j = (i + 1) % n
        try:
            bm.faces.new((vb[i], vb[j], vt[j], vt[i]))
        except ValueError:
            pass
    try:
        bm.faces.new(vt)
    except ValueError:
        pass
    if cap_bottom:
        try:
            bm.faces.new(list(reversed(vb)))
        except ValueError:
            pass
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    obj = mesh_from_bmesh(name, bm)
    obj.data.materials.append(mat)
    bevel(obj, bevel_w, 2)
    shade_smooth(obj, smooth_angle)
    if uv:
        uv_cube(obj, uv)
    return obj


def chamfered_box_plan(z_aft, z_fwd, hw_aft, hw_fwd, ch_fwd=2.0, ch_aft=1.6, hw_mid=None,
                       z_mid_f=None, z_mid_a=None):
    """Plan polygon for a deckhouse block: chamfered corners fore and aft, optional
    wider parallel midbody."""
    hw_mid = hw_mid if hw_mid is not None else max(hw_aft, hw_fwd)
    z_mid_f = z_mid_f if z_mid_f is not None else z_fwd - ch_fwd * 1.8
    z_mid_a = z_mid_a if z_mid_a is not None else z_aft + ch_aft * 1.8
    return [
        (hw_fwd - ch_fwd, z_fwd),
        (hw_fwd, z_fwd - ch_fwd),
        (hw_mid, z_mid_f),
        (hw_mid, z_mid_a),
        (hw_aft, z_aft + ch_aft),
        (hw_aft - ch_aft, z_aft),
        (-(hw_aft - ch_aft), z_aft),
        (-hw_aft, z_aft + ch_aft),
        (-hw_mid, z_mid_a),
        (-hw_mid, z_mid_f),
        (-hw_fwd, z_fwd - ch_fwd),
        (-(hw_fwd - ch_fwd), z_fwd),
    ]


def sheer(z):
    """Main-deck height above the waterline. Burkes have strong forward sheer."""
    fwd = max(0.0, (z - 12.0) / 63.0)
    return DECK_Y + 4.35 * (fwd ** 1.55) * (1.0 - 0.12 * (1.0 - fwd) ** 2)


# --------------------------------------------------------------------------
# materials
# --------------------------------------------------------------------------
# US Navy Haze Gray is a medium *blue*-gray. The runtime (_addMicroDetailMaps)
# swaps a procedural haze texture in for these on the hero hull, so these values
# are the no-texture fallback — they intentionally match the texture's tone.
mat_hull = new_mat("HullHazeGrey", hexc("6E7A85"), 0.56, 0.06)
mat_super = new_mat("SuperHazeGrey", hexc("74808B"), 0.54, 0.05)
mat_deck = new_mat("DeckNonskid", hexc("4A5259"), 0.90, 0.03)
mat_boot = new_mat("BootTopBlack", hexc("14171A"), 0.80, 0.03)
mat_keel = new_mat("KeelBlack", hexc("2A1F1C"), 0.85, 0.02)
mat_metal = new_mat("DarkMetal", hexc("31373C"), 0.42, 0.72)
# Radar arrays / mast furniture on a real Burke are painted grey, not black — dark
# metal up there reads as a spindly antique lattice mast. Named so it dodges every
# regex in CrewedShip._addMicroDetailMaps and keeps exactly this authored colour.
mat_array = new_mat("ArrayFaceGrey", hexc("99A1A8"), 0.58, 0.10)
mat_radome = new_mat("RadomeWhite", hexc("C9CCCE"), 0.46, 0.02)
mat_spy = new_mat("SPYFace", hexc("23282D"), 0.44, 0.35)
mat_vls = new_mat("VLSCell", hexc("2C3237"), 0.50, 0.45)
mat_mark = new_mat("HelipadMarking", hexc("D8D9D2"), 0.72, 0.03)
mat_glass = new_mat("Bridge_Glass", hexc("0D1519"), 0.10, 0.35)
# Painted hull number ("119" for DDG-119) — a thin alpha decal on the bow flare.
mat_number = new_mat("Marking_HullNumber", hexc("C6C8C2"), 0.62, 0.02)
mat_number.blend_method = "BLEND"

HULL_MATS = [mat_hull, mat_deck, mat_boot, mat_keel]  # indices 0..3

# --------------------------------------------------------------------------
# PBR TEXTURE PASS — real weathered-steel maps (plate seams, rust streaking,
# non-skid grit, spatial roughness) baked into the paint materials. This is
# what moves the hull off "grey blockout plastic". See warship_textures.py.
# The runtime keeps these because a material with a baked map short-circuits
# CrewedShip._addMicroDetailMaps' procedural-map generation.
# --------------------------------------------------------------------------
_steel = wtex.build_steel_set(size=512, seed=21, base_hex="6E7A85",
                              strakes=5, frames=4, rust=0.6, name="BK_STEEL")
_super = wtex.build_steel_set(size=512, seed=27, base_hex="74808B",
                              strakes=6, frames=5, rust=0.4, name="BK_SUPER")
_nonskid = wtex.build_nonskid_set(size=512, seed=31, base_hex="3E464C", name="BK_NONSKID")
_metal = wtex.build_metal_set(size=256, seed=51, base_hex="2E343A", name="BK_METAL")
_boot = wtex.build_flat_set(size=256, seed=61, base_hex="141719",
                            rough_val=0.48, streak=0.7, name="BK_BOOT")
_keel = wtex.build_flat_set(size=256, seed=71, base_hex="3A1512", rough_val=0.86, name="BK_KEEL")

# Paint materials link metalness from the ORM's B channel (which is 0), not a
# scalar: that keeps the packed metallicRoughness map exportable as JPEG instead of
# forcing a PNG re-encode, and the 0 B-channel keeps the paint non-metallic through
# the runtime's metalness-factor clamps regardless.
wtex.assign_pbr(mat_hull, _steel, metallic=None, uv_scale=1.0)
wtex.assign_pbr(mat_super, _super, metallic=None, uv_scale=1.0)
wtex.assign_pbr(mat_deck, _nonskid, metallic=None, uv_scale=1.0)
wtex.assign_pbr(mat_boot, _boot, metallic=None, uv_scale=1.0)
wtex.assign_pbr(mat_keel, _keel, metallic=None, uv_scale=1.0)
wtex.assign_pbr(mat_metal, _metal, metallic=0.72, uv_scale=1.0)
wtex.assign_pbr(mat_vls, _metal, metallic=0.55, uv_scale=1.0)


# --------------------------------------------------------------------------
# HULL — lofted stations with a real flat deck, forward sheer, knuckle,
# flared bow and a flat transom.
# --------------------------------------------------------------------------
#   z,     hb_wl, hb_deck, bottom_y
STATIONS = [
    (-HALF,      6.35, 6.95, -1.70),   # transom
    (-73.0,      7.05, 7.70, -2.70),
    (-66.0,      7.95, 8.55, -3.45),
    (-56.0,      8.75, 9.25, -3.95),
    (-42.0,      9.40, 9.80, -4.28),
    (-24.0,      9.80, 10.02, -4.42),
    (-6.0,       9.95, 10.10, -4.46),
    (12.0,       9.75, 10.05, -4.36),
    (28.0,       9.15, 9.85, -4.10),
    (42.0,       8.05, 9.35, -3.62),
    (54.0,       6.40, 8.45, -3.00),
    (63.0,       4.55, 7.05, -2.25),
    (70.0,       2.45, 5.15, -1.30),
    (73.0,       1.35, 3.85, -0.15),   # forefoot — hull leaves the water here,
    (75.5,       0.55, 2.15, 1.20),    # so the stem above it reads as a rake
    (HALF,       0.08, 0.42, 2.90),
]


def station_ring(z, hb_wl, hb_deck, ybot, ydeck):
    """Half-section from keel up the side to the deck edge and in to the
    centreline, then mirrored. Gives a hard knuckle at ~60% of the freeboard."""
    pts = [(0.0, ybot)]
    NB = 10
    for i in range(1, NB + 1):
        th = (i / NB) * (math.pi * 0.5)
        s = math.sin(th)
        pts.append((hb_wl * (s ** 0.68), ybot * (1.0 - s ** 1.55)))
    fb = ydeck  # freeboard from waterline to deck edge
    # Hard knuckle: near-vertical out of the water, one sharp flare panel, then a
    # slight tumblehome to the deck edge. Two >30 deg breaks so auto-smooth leaves
    # a crisp knuckle line running aft instead of a bloated rounded blister.
    pts.append((hb_wl * 1.004, fb * 0.18))
    pts.append((hb_deck * 1.008, fb * 0.38))
    pts.append((hb_deck, fb * 0.58))               # KNUCKLE — max beam (rounded)
    pts.append((hb_deck * 0.988, fb * 0.92))
    pts.append((hb_deck * 0.984, fb))              # deck edge
    pts.append((hb_deck * 0.55, fb + 0.17))        # deck camber
    pts.append((0.0, fb + 0.27))
    ring = pts + [(-x, y) for (x, y) in reversed(pts[1:-1])]
    return [(x, y, z) for (x, y) in ring]


bm = bmesh.new()
rings = []
for z, hbw, hbd, ybot in STATIONS:
    rings.append([bm.verts.new(p) for p in station_ring(z, hbw, hbd, ybot, sheer(z))])
for ri in range(len(rings) - 1):
    a, b = rings[ri], rings[ri + 1]
    for i in range(len(a)):
        j = (i + 1) % len(a)
        try:
            bm.faces.new((a[i], a[j], b[j], b[i]))
        except ValueError:
            pass
try:
    bm.faces.new(rings[0])       # transom cap
except ValueError:
    pass
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)

# Per-face material: nonskid on the deck, haze on the topsides, boot-topping band
# at the waterline, dark bottom paint below.
for f in bm.faces:
    c = f.calc_center_median()
    nrm = f.normal
    if nrm.y > 0.55 and c.y > 4.0:
        f.material_index = 1
    elif c.y < -0.75:
        f.material_index = 3
    elif c.y < 0.55:
        f.material_index = 2
    else:
        f.material_index = 0

hull = mesh_from_bmesh("Hull", bm)
for m in HULL_MATS:
    hull.data.materials.append(m)
bevel(hull, 0.07, 2, angle=34)
shade_smooth(hull, 30)
# World-scale box projection (not smart-project): the tiling steel/nonskid/boot maps
# need a CONSISTENT physical plate pitch and vertical streak direction across the whole
# hull. Smart-project's per-face islands scatter panel-line scale/orientation randomly.
uv_cube(hull, 7.5)

def deck_hw(z):
    """Deck-edge half-beam, interpolated straight off the hull stations so coamings
    and lifelines follow the actual sheer plan instead of poking out at the bow."""
    z = max(STATIONS[0][0], min(STATIONS[-1][0], z))
    for i in range(len(STATIONS) - 1):
        z0, _, d0, _ = STATIONS[i]
        z1, _, d1, _ = STATIONS[i + 1]
        if z0 <= z <= z1:
            t = (z - z0) / (z1 - z0) if z1 > z0 else 0.0
            return (d0 + (d1 - d0) * t) * 0.984
    return STATIONS[-1][2] * 0.984


# Low continuous deck-edge coaming. Segments are short, generously overlapped and
# yawed to follow the sheer plan — earlier tall/gappy blocks read as a picket fence
# standing on the forecastle rather than an edge strip.
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    for i in range(50):
        z0 = -76.5 + i * 3.05
        z1 = z0 + 3.05
        if z1 > 73.5:
            break
        zc = (z0 + z1) * 0.5
        yaw = math.atan2((deck_hw(z1) - deck_hw(z0)) * side, z1 - z0)
        add_box(f"DeckEdge_{tag}_{i}", (side * (deck_hw(zc) - 0.05), sheer(zc) + 0.12, zc),
                (0.22, 0.30, (z1 - z0) * 1.06), mat_hull, 0.02, rot=(0, -yaw, 0), uv=6.0)

# Breakwater on the forecastle (low V, apex forward)
for side in (-1, 1):
    add_box(f"Breakwater_{'S' if side > 0 else 'P'}", (side * 3.4, sheer(46) + 0.55, 46.4),
            (7.2, 1.1, 0.26), mat_hull, 0.04, rot=(0, math.radians(side * 22), 0), uv=5.0)

# Bow anchor / hawse detail
for side in (-1, 1):
    add_box(f"Hawse_{'S' if side > 0 else 'P'}", (side * 2.6, sheer(68) - 1.9, 68.0),
            (1.1, 1.5, 2.2), mat_metal, 0.06, uv=4.0)
add_box("Bullnose", (0, sheer(75.6) - 0.5, 75.6), (1.6, 1.1, 1.6), mat_metal, 0.06, uv=4.0)

# Sonar dome bulge under the forefoot (SQS-53C)
bpy.ops.mesh.primitive_uv_sphere_add(radius=3.0, location=(0, -3.4, 60.0), segments=18, ring_count=10)
dome = bpy.context.active_object
dome.name = "SonarDome"
dome.scale = (0.78, 0.62, 2.5)
bpy.ops.object.transform_apply(scale=True)
dome.data.materials.append(mat_keel)
shade_smooth(dome, 45)

for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    for i, zc in enumerate([58.0, 63.5, 68.5, 72.5]):
        hw = deck_hw(zc) * 0.92
        yd = sheer(zc)
        flare = 0.55 + i * 0.18
        add_box(f"BowFlare_{tag}_{i}", (side * (hw + flare * 0.35), yd - 1.2 + i * 0.22, zc),
                (flare, 2.4 - i * 0.25, 4.8 - i * 0.35), mat_hull, 0.12,
                rot=(math.radians(-4 - i * 2), math.radians(side * (8 + i * 3)), 0), uv=5.0)
bpy.ops.mesh.primitive_cone_add(radius1=1.05, radius2=0.18, depth=3.6,
                                location=(0, sheer(76.2) + 0.85, 76.0), vertices=14)
stem = bpy.context.active_object
stem.name = "StemCap"
stem.rotation_euler = (math.radians(90), 0, 0)
bpy.ops.object.transform_apply(rotation=True)
stem.data.materials.append(mat_hull)
bevel(stem, 0.08, 2)
shade_smooth(stem, 35)

# ---- painted bow hull number "119" (DDG-119 Meridian) -------------------------
# A thin alpha decal quad on each bow flank, following the local deck-edge taper
# and sitting a hair proud of the plating so it reads as paint, not a floating card.
_num_img = wtex.make_number_image("119", "BK_NUM119", fg_hex="C6C8C2", size_h=96)
mat_number.use_backface_culling = False
_nt = mat_number.node_tree
_bsdf = _nt.nodes.get("Principled BSDF")
_texn = _nt.nodes.new("ShaderNodeTexImage")
_texn.image = _num_img
_texn.location = (-400, 0)
_nt.links.new(_texn.outputs["Color"], _bsdf.inputs["Base Color"])
_nt.links.new(_texn.outputs["Alpha"], _bsdf.inputs["Alpha"])


def hull_number(tag, side, zc=67.0, half_z=2.9, half_y=1.15):
    yc = sheer(zc) - 2.55
    bm2 = bmesh.new()
    uvl = bm2.loops.layers.uv.new("UVMap")
    # corners: aft-bot, aft-top, fwd-top, fwd-bot (aft = -z, fwd = +z)
    zs = [zc - half_z, zc - half_z, zc + half_z, zc + half_z]
    ys = [yc - half_y, yc + half_y, yc + half_y, yc - half_y]
    verts = []
    for z, y in zip(zs, ys):
        # deck_hw already carries the 0.984 deck-edge factor; the hull's max-beam
        # KNUCKLE sits ~deck_hw/0.984 outboard, so proud of *that* (+0.32) or the
        # decal buries itself in the flare and only a corner pokes through.
        x = side * (deck_hw(z) / 0.984 + 0.32)
        verts.append(bm2.verts.new((x, y, z)))
    f = bm2.faces.new(verts)
    bm2.normal_update()
    if f.normal.x * side < 0:      # ensure it faces outboard
        f.normal_flip()
    # u runs bow->stern reading order on each side (starboard reads +z->-z from
    # outboard, port the mirror), v runs bottom->top
    us = [1, 1, 0, 0] if side > 0 else [0, 0, 1, 1]
    vs = [0, 1, 1, 0]
    for loop, u, v in zip(f.loops, us, vs):
        loop[uvl].uv = (u, v)
    obj = mesh_from_bmesh(f"HullNumber_{tag}", bm2)
    obj.data.materials.append(mat_number)
    return obj


hull_number("S", 1)
hull_number("P", -1)



# --------------------------------------------------------------------------
# SUPERSTRUCTURE — big, stepped, faceted. This is the whole point of the pass:
# on a Burke the deckhouse is nearly full beam at its base and towers over the
# hull; a small low box on a flat deck reads as a 1960s ship.
# --------------------------------------------------------------------------
SS_FWD, SS_AFT = 31.5, -34.0

plan01 = chamfered_box_plan(SS_AFT, SS_FWD, hw_aft=8.4, hw_fwd=6.6, ch_fwd=2.3, ch_aft=2.0,
                            hw_mid=9.25, z_mid_f=25.0, z_mid_a=-29.0)
poly_prism("Deckhouse01", plan01, DECK_Y - 0.1, L01, mat_super, inset_top=0.38, uv=9.0)

plan02 = chamfered_box_plan(-31.0, 30.5, hw_aft=8.0, hw_fwd=6.2, ch_fwd=2.2, ch_aft=1.9,
                            hw_mid=8.85, z_mid_f=24.0, z_mid_a=-26.5)
poly_prism("Deckhouse02", plan02, L01 - 0.05, L02, mat_super, inset_top=0.34, uv=9.0)

# 03 level — carries the four SPY-1D faces on deeply chamfered corners.
SPY_CH = 4.0          # chamfer run in x
SPY_DZ = 3.36         # chamfer run in z -> 40 deg cant from the centreline
plan03 = [
    (4.60, 29.80),
    (8.60, 29.80 - SPY_DZ),
    (8.40, 20.0),
    (8.40, -18.0),
    (8.60, -25.84),
    (4.60, -29.20),
    (-4.60, -29.20),
    (-8.60, -25.84),
    (-8.40, -18.0),
    (-8.40, 20.0),
    (-8.60, 29.80 - SPY_DZ),
    (-4.60, 29.80),
]
poly_prism("Deckhouse03", plan03, L02 - 0.05, L03, mat_super, inset_top=0.30, uv=9.0)

# 04 / bridge level. Sized to fully enclose the walk-in BridgeInterior room
# (X -8.3..9.6, Z 5.5..23.5, Y 19.4..22.3) — backface culling hides these walls
# from inside, so the player still sees out through the interior's own glass.
plan04 = [
    (5.10, 26.60),
    (8.30, 23.20),
    (8.30, 5.00),
    (7.30, 2.80),
    (-7.30, 2.80),
    (-8.30, 5.00),
    (-8.30, 23.20),
    (-5.10, 26.60),
]
poly_prism("BridgeShell", plan04, L03 - 0.05, L04, mat_super, inset_top=0.42, uv=8.0)

# Enclosed bridge wings — thin, lower than the pilothouse roof so the tier still
# steps, and they carry the interior's starboard lookout position.
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    wing = [
        (side * 8.15, 24.20), (side * 10.15, 22.60),
        (side * 10.15, 5.60), (side * 8.15, 4.40),
    ]
    poly_prism(f"BridgeWing_{tag}", wing, L03 - 0.05, 22.55, mat_super, inset_top=0.30, uv=7.0)
    # wing rail
    add_box(f"BridgeWingRail_{tag}", (side * 10.1, 23.35, 14.0), (0.10, 0.10, 19.0), mat_metal, 0, uv=0)
    for k in range(7):
        add_box(f"BridgeWingStanch_{tag}_{k}", (side * 10.1, 23.0, 5.6 + k * 3.0),
                (0.09, 0.85, 0.09), mat_metal, 0, uv=0, smooth=False)

# Pilothouse roof house + raked front face detail
poly_prism("BridgeRoofHouse", [
    (4.60, 25.40), (6.60, 22.60), (6.60, 12.60), (-6.60, 12.60), (-6.60, 22.60), (-4.60, 25.40),
], L04 - 0.05, L04 + 1.6, mat_super, inset_top=0.30, uv=6.0)

# Bridge windows — dark tinted band wrapping the pilothouse front and sides. The
# shell's front face is raked (inset_top 0.42 over 4.45 m ~ 5.4 deg), so the glass
# is rotated to match and pushed slightly proud or it half-buries itself.
WIN_Y = (WIN_LO + WIN_HI) * 0.5
WIN_H = WIN_HI - WIN_LO
RAKE = math.atan2(0.42, L04 - L03)
add_box("Bridge_Glass", (0, WIN_Y, 26.62 - (WIN_Y - L03) * math.tan(RAKE)),
        (10.4, WIN_H, 0.34), mat_glass, 0.02, rot=(RAKE, 0, 0), uv=0)
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    add_box(f"Bridge_GlassCant_{tag}", (side * 6.90, WIN_Y, 24.95),
            (5.0, WIN_H, 0.34), mat_glass, 0.02,
            rot=(0, math.radians(side * 46), 0), uv=0)
    add_box(f"Bridge_GlassSide_{tag}", (side * 8.36, WIN_Y, 16.5),
            (0.34, WIN_H, 12.0), mat_glass, 0.02, uv=0)
    # eyebrow / spray strake over the glass — reads as a hard shadow line
    add_box(f"BridgeEyebrow_{tag}", (side * 6.95, WIN_HI + 0.28, 24.85),
            (5.2, 0.26, 0.85), mat_super, 0.03, rot=(0, math.radians(side * 46), 0), uv=0)
add_box("BridgeEyebrow_F", (0, WIN_HI + 0.30, 26.35), (10.6, 0.28, 0.95), mat_super, 0.03, uv=0)
# window mullions
for k in range(7):
    add_box(f"BridgeMullion_{k}", (-4.5 + k * 1.5, WIN_Y, 26.72 - (WIN_Y - L03) * math.tan(RAKE)),
            (0.18, WIN_H + 0.12, 0.30), mat_metal, 0, rot=(RAKE, 0, 0), uv=0, smooth=False)


# ---- SPY-1D: four octagonal phased-array faces on canted corners --------------
def spy_face(tag, x, z, y, yaw_deg, tilt_deg=12.0):
    """Octagonal SPY-1D panel + frame + housing, flush on a canted face."""
    rx = math.radians(-tilt_deg)          # normal tips up => panel leans back
    ry = math.radians(yaw_deg)
    nx = math.sin(ry) * math.cos(rx)
    nz = math.cos(ry) * math.cos(rx)

    # canted housing block behind the array
    add_box(f"SPY_Housing_{tag}", (x - nx * 0.72, y, z - nz * 0.72), (6.2, 6.2, 1.7),
            mat_super, 0.12, rot=(rx, ry, 0), uv=5.0)
    add_box(f"SPY_Recess_{tag}", (x - nx * 0.48, y, z - nz * 0.48), (5.1, 5.1, 0.85),
            mat_metal, 0.08, rot=(rx, ry, 0), uv=4.0)
    add_box(f"SPY_Shadow_{tag}", (x - nx * 0.26, y, z - nz * 0.26), (4.5, 4.5, 0.2),
            mat_metal, 0.05, rot=(rx, ry, 0), uv=3.0)

    for suffix, radius, depth, mat, push in (
        ("Frame", 2.55, 0.55, mat_metal, 0.10),
        ("FrameInner", 2.35, 0.16, mat_metal, 0.05),
        ("Face", 2.16, 0.30, mat_spy, 0.26),
    ):
        bpy.ops.mesh.primitive_cylinder_add(radius=radius, depth=depth, vertices=8,
                                            location=(0, 0, 0))
        o = bpy.context.active_object
        o.name = f"SPY_{suffix}_{tag}"
        o.rotation_euler = (0, 0, math.radians(22.5))   # flat-topped octagon
        bpy.ops.object.transform_apply(rotation=True)
        o.rotation_euler = (rx, ry, 0)
        o.location = (x + nx * push, y, z + nz * push)
        bpy.ops.object.transform_apply(location=False, rotation=True)
        o.data.materials.clear()
        o.data.materials.append(mat)
        bevel(o, 0.04, 1)
        shade_smooth(o, 20)


# forward pair: on the 03-level forward chamfers (40 deg off the centreline)
spy_face("FwdS", 6.72, 28.30, 16.2, 40.0)
spy_face("FwdP", -6.72, 28.30, 16.2, -40.0)
# aft pair: on the 03-level after chamfers
spy_face("AftS", 6.72, -27.65, 15.4, 140.0)
spy_face("AftP", -6.72, -27.65, 15.4, -140.0)

# SLQ-32 EW "cheek" arrays outboard of the 03 level
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    add_box(f"SLQ32_{tag}", (side * 8.85, 17.2, 12.0), (1.1, 2.1, 3.4), mat_metal, 0.08,
            rot=(0, 0, math.radians(-side * 8)), uv=4.0)


# --------------------------------------------------------------------------
# MAST — a real mast, not a pole with a ball. Truck ~45 m above the waterline.
# --------------------------------------------------------------------------
# Substantial enclosed lower mast — a Burke's is a real structure, not a pole.
mast_plan = [(3.2, 12.4), (3.9, 8.6), (3.9, 1.2), (3.0, -1.4),
             (-3.0, -1.4), (-3.9, 1.2), (-3.9, 8.6), (-3.2, 12.4)]
poly_prism("MastTower", mast_plan, L04 + 1.4, 31.4, mat_super, inset_top=1.10, uv=6.0)
add_box("MastPlatform", (0, 31.55, 5.4), (9.4, 0.34, 7.6), mat_super, 0.05, uv=5.0)
add_box("MastPlatformMid", (0, 34.25, 5.4), (7.8, 0.30, 6.2), mat_super, 0.05, uv=4.0)
add_box("MastPlatformUpper", (0, 37.85, 5.4), (5.6, 0.26, 4.8), mat_super, 0.04, uv=4.0)
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    add_box(f"MastPlatMidRail_{tag}", (side * 3.8, 34.85, 5.4), (0.10, 0.10, 5.8), mat_metal, 0, uv=0)
    add_box(f"MastPlatUpRail_{tag}", (side * 2.7, 38.35, 5.4), (0.09, 0.09, 4.2), mat_metal, 0, uv=0)
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    for k in range(6):
        add_box(f"MastPlatRail_{tag}_{k}", (side * 4.6, 32.2, 2.2 + k * 1.4),
                (0.09, 1.1, 0.09), mat_metal, 0, uv=0, smooth=False)
    add_box(f"MastPlatRailTop_{tag}", (side * 4.6, 32.75, 5.4), (0.12, 0.12, 7.4),
            mat_metal, 0, uv=0, smooth=False)

# SPS-49(V) 2D air search — big flat back-to-back rotating array, painted grey
add_box("Radar_SPS49_Boom", (0, 32.6, 5.4), (2.0, 2.1, 2.0), mat_super, 0.06, uv=3.0)
add_box("Radar_SPS49", (0, 35.0, 5.05), (8.4, 3.9, 0.40), mat_array, 0.07,
        rot=(math.radians(-9), 0, 0), uv=4.0)
add_box("Radar_SPS49_Rib", (0, 35.0, 4.72), (8.7, 0.34, 0.60), mat_array, 0.04, uv=3.0)
for k in range(5):
    add_box(f"Radar_SPS49_Stiff_{k}", (-3.4 + k * 1.7, 35.0, 4.80), (0.16, 3.8, 0.30),
            mat_array, 0, uv=0, smooth=False)

# upper mast + yardarms — haze grey, tapering, with a proper truck
poly_prism("MastUpper", [(1.85, 9.0), (1.85, 1.9), (-1.85, 1.9), (-1.85, 9.0)],
           31.3, 40.2, mat_super, inset_top=1.28, uv=4.0)
add_box("MastYardLower", (0, 36.4, 5.4), (11.6, 0.28, 0.62), mat_array, 0.03, uv=0)
add_box("MastYardUpper", (0, 39.4, 5.4), (7.0, 0.24, 0.50), mat_array, 0.03, uv=0)
add_box("MastTruckPlate", (0, 40.3, 5.4), (2.4, 0.26, 2.4), mat_array, 0.03, uv=0)
add_cyl("MastTruck", (0, 42.9, 5.4), 0.24, 5.4, mat_array, rot=(math.radians(90), 0, 0), verts=8)
add_cyl("MastTruckTip", (0, 45.6, 5.4), 0.10, 1.4, mat_array, rot=(math.radians(90), 0, 0), verts=6)

# SPQ-9B / SPS-67 surface search radomes and antennas on the mast
bpy.ops.mesh.primitive_uv_sphere_add(radius=1.45, location=(0, 38.0, 5.4), segments=16, ring_count=10)
spq = bpy.context.active_object
spq.name = "Radome_SPQ9B"
spq.data.materials.append(mat_radome)
shade_smooth(spq, 45)
add_box("Radar_SPS67", (0, 36.9, 5.4), (4.2, 0.62, 0.34), mat_array, 0.03, uv=0)
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    add_box(f"Whip_{tag}", (side * 5.5, 38.4, 5.4), (0.11, 5.4, 0.11), mat_array, 0, uv=0, smooth=False)
    add_box(f"MastNav_{tag}", (side * 3.1, 33.6, 9.0), (1.1, 1.1, 1.6), mat_super, 0.06, uv=0)
    add_box(f"MastIFF_{tag}", (side * 4.4, 36.75, 5.4), (2.6, 0.9, 0.24), mat_array, 0.03, uv=0)

# SPG-62 illuminators — three on a Burke (one fwd of the mast, two aft)
def illuminator(name, x, y, z):
    add_box(f"{name}_Ped", (x, y - 1.0, z), (1.9, 2.0, 1.9), mat_super, 0.08, uv=3.0)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1.28, location=(x, y + 0.55, z), segments=16, ring_count=10)
    o = bpy.context.active_object
    o.name = name
    o.scale = (1.0, 0.92, 1.0)
    bpy.ops.object.transform_apply(scale=True)
    o.data.materials.append(mat_radome)
    shade_smooth(o, 45)


illuminator("SPG62_Fwd", 0, L04 + 2.9, 20.0)
illuminator("SPG62_AftP", -3.7, 26.6, -21.5)
illuminator("SPG62_AftS", 3.7, 26.6, -21.5)


# --------------------------------------------------------------------------
# MACKS (mast + stack) — faceted, tall, unmistakably modern
# --------------------------------------------------------------------------
def mack(name, z_aft, z_fwd, y_top, hw=5.3):
    plan = chamfered_box_plan(z_aft, z_fwd, hw_aft=hw - 0.5, hw_fwd=hw - 0.5,
                              ch_fwd=1.5, ch_aft=1.5, hw_mid=hw,
                              z_mid_f=z_fwd - 2.6, z_mid_a=z_aft + 2.6)
    poly_prism(name, plan, L03 - 0.05, y_top, mat_super, inset_top=1.25, uv=6.0)
    cap_hw = hw - 1.25
    add_box(f"{name}_Cap", (0, y_top + 0.16, (z_aft + z_fwd) * 0.5),
            (cap_hw * 2.0 + 0.5, 0.32, (z_fwd - z_aft) - 2.2), mat_metal, 0.05, uv=4.0)
    for side in (-1, 1):
        add_box(f"{name}_Uptake_{'S' if side > 0 else 'P'}",
                (side * (cap_hw * 0.48), y_top + 1.25, (z_aft + z_fwd) * 0.5),
                (cap_hw * 0.72, 2.1, (z_fwd - z_aft) - 4.4), mat_metal, 0.08, uv=4.0)


mack("MackFwd", -13.5, -1.5, 27.2, hw=5.4)
mack("MackAft", -28.0, -16.5, 25.4, hw=5.1)


# --------------------------------------------------------------------------
# Mk 45 Mod 4 5"/62 gun — signature forecastle silhouette
# --------------------------------------------------------------------------
GUN_Z = 51.0
GUN_DECK = sheer(GUN_Z)
add_cyl("GunBarbette", (0, GUN_DECK + 0.55, GUN_Z), 3.05, 1.2, mat_super,
        rot=(math.radians(90), 0, 0), verts=20)
# Faceted stealth gunhouse: wedge front, slab sides, sloped shoulders.
gun_plan = [
    (0.95, 5.10), (2.25, 3.70), (2.40, -1.30), (1.95, -3.40),
    (-1.95, -3.40), (-2.40, -1.30), (-2.25, 3.70), (-0.95, 5.10),
]
gun_plan = [(x, z + GUN_Z) for (x, z) in gun_plan]
poly_prism("GunHouse", gun_plan, GUN_DECK + 1.05, GUN_DECK + 4.35, mat_super,
           inset_top=0.62, bevel_w=0.16, uv=4.0)
add_box("GunHouseCheekP", (-2.05, GUN_DECK + 2.7, GUN_Z + 0.6), (0.7, 3.2, 8.0), mat_super, 0.10,
        rot=(0, 0, math.radians(11)), uv=3.0)
add_box("GunHouseCheekS", (2.05, GUN_DECK + 2.7, GUN_Z + 0.6), (0.7, 3.2, 8.0), mat_super, 0.10,
        rot=(0, 0, math.radians(-11)), uv=3.0)
# sloped front shield the barrel comes through
add_box("GunShield", (0, GUN_DECK + 3.05, GUN_Z + 4.55), (3.1, 2.6, 2.1), mat_super, 0.16,
        rot=(math.radians(-18), 0, 0), uv=3.0)
add_cyl("GunBarrelSleeve", (0, GUN_DECK + 3.15, GUN_Z + 5.9), 0.42, 3.4, mat_metal, verts=12, bevel_w=0)
add_cyl("GunBarrel", (0, GUN_DECK + 3.20, GUN_Z + 9.5), 0.21, 8.4, mat_metal, verts=12, bevel_w=0)
add_cyl("GunMuzzle", (0, GUN_DECK + 3.20, GUN_Z + 13.4), 0.27, 0.9, mat_metal, verts=12, bevel_w=0)
add_empty("GunBarrelTip", (0, GUN_DECK + 3.20, GUN_Z + 14.1))


# --------------------------------------------------------------------------
# Mk 41 VLS — flush hatch grids, 32 cells fwd / 64 cells aft
# --------------------------------------------------------------------------
def vls(prefix, zc, cols, rows, px, pz, deck_y):
    """Mk 41 block: a low raised structure (the launcher sits proud of the deck),
    module divider beams and dark hatches. Perfectly flush cells vanish at any
    distance, which is why the previous pass read as bare deck."""
    w = cols * px
    d = rows * pz
    add_box(f"VLS_{prefix}_Base", (0, deck_y + 0.42, zc), (w + 2.4, 0.84, d + 2.2),
            mat_super, 0.08, uv=4.0)
    add_box(f"VLS_{prefix}_Coaming", (0, deck_y + 0.92, zc), (w + 1.5, 0.28, d + 1.3),
            mat_metal, 0.03, uv=3.0)
    n = 0
    for r in range(rows):
        for c in range(cols):
            x = (c - (cols - 1) * 0.5) * px
            z = zc + (r - (rows - 1) * 0.5) * pz
            add_box(f"{prefix}_Cell_{n}", (x, deck_y + 1.02, z),
                    (px * 0.78, 0.16, pz * 0.78), mat_vls, 0.02, uv=0, smooth=False)
            n += 1
    # module divider beams every 4 cells across
    for c in range(1, cols):
        if c % 4:
            continue
        add_box(f"VLS_{prefix}_Div_{c}", ((c - cols * 0.5) * px, deck_y + 1.06, zc),
                (0.22, 0.22, d + 0.9), mat_metal, 0, uv=0, smooth=False)
    add_empty(f"MissileTube_{prefix}", (0, deck_y + 1.6, zc))


vls("Fwd", 40.0, cols=4, rows=8, px=1.30, pz=1.05, deck_y=sheer(40.0))
vls("Aft", -37.0, cols=8, rows=8, px=1.05, pz=1.05, deck_y=DECK_Y)


# --------------------------------------------------------------------------
# Flight IIA aft end — twin hangar, flight deck, markings
# --------------------------------------------------------------------------
HANGAR_AFT, HANGAR_FWD = -58.0, -43.0
hangar_plan = chamfered_box_plan(HANGAR_AFT, HANGAR_FWD, hw_aft=7.15, hw_fwd=7.4,
                                 ch_fwd=1.6, ch_aft=1.3, hw_mid=7.7,
                                 z_mid_f=HANGAR_FWD - 3.0, z_mid_a=HANGAR_AFT + 2.6)
poly_prism("Hangar", hangar_plan, DECK_Y - 0.1, 14.4, mat_super, inset_top=0.50, uv=8.0)
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    add_box(f"HangarDoor_{tag}", (side * 3.3, DECK_Y + 3.2, HANGAR_AFT - 0.05),
            (5.1, 6.4, 0.28), mat_metal, 0.05, uv=4.0)
    add_box(f"HangarRail_{tag}", (side * 7.0, 15.05, -50.5), (0.10, 0.10, 13.0), mat_metal, 0, uv=0)
    for k in range(5):
        add_box(f"HangarStanch_{tag}_{k}", (side * 7.0, 14.7, -56.0 + k * 3.0),
                (0.09, 0.85, 0.09), mat_metal, 0, uv=0, smooth=False)
add_box("HangarFace", (0, 11.6, HANGAR_AFT - 0.35), (14.4, 1.5, 0.5), mat_super, 0.06, uv=4.0)

# Hangar lip / flight-deck greebles
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    add_box(f"HangarSill_{tag}", (side * 5.8, DECK_Y + 0.55, -48.0),
            (2.2, 0.28, 0.55), mat_metal, 0.04, uv=0)
add_box("FlightDeckCamber", (0, DECK_Y + 0.22, -62.0), (15.6, 0.18, 22.0), mat_deck, 0.06, uv=6.0)
for k in range(8):
    z = -70.0 + k * 2.4
    add_box(f"PadTieDown_{k}", (math.sin(k * 1.7) * 3.2, DECK_Y + 0.31, z),
            (0.26, 0.05, 0.26), mat_metal, 0, uv=0, smooth=False)

# Flight deck markings (the hull's own deck faces are already nonskid)
PAD_Z = -68.0
for k in range(28):
    a = (k / 28.0) * math.tau
    add_box(f"PadRing_{k}", (math.sin(a) * 5.4, DECK_Y + 0.30, PAD_Z + math.cos(a) * 5.4),
            (0.62, 0.05, 0.62), mat_mark, 0, rot=(0, -a, 0), uv=0, smooth=False)
add_box("PadLineup", (0, DECK_Y + 0.30, PAD_Z + 1.0), (0.34, 0.05, 15.0), mat_mark, 0, uv=0, smooth=False)
add_box("PadBar", (0, DECK_Y + 0.30, PAD_Z), (7.6, 0.05, 0.34), mat_mark, 0, uv=0, smooth=False)
for side in (-1, 1):
    add_box(f"DeckEdgeLine_{'S' if side > 0 else 'P'}", (side * 7.9, DECK_Y + 0.30, -66.0),
            (0.26, 0.05, 20.0), mat_mark, 0, uv=0, smooth=False)

# Aft CIWS above the hangar face, forward CIWS on the pilothouse roof
def ciws(name, x, y, z, yaw=0.0):
    add_box(f"{name}_Tub", (x, y + 0.7, z), (3.5, 1.4, 3.5), mat_super, 0.10, uv=3.0)
    add_box(f"{name}_Base", (x, y + 1.75, z), (2.3, 1.0, 2.3), mat_metal, 0.06, uv=0)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1.15, location=(x, y + 3.15, z), segments=16, ring_count=10)
    o = bpy.context.active_object
    o.name = name
    o.scale = (1.0, 1.35, 1.0)
    bpy.ops.object.transform_apply(scale=True)
    o.data.materials.append(mat_radome)
    shade_smooth(o, 45)
    add_cyl(f"{name}_Gun", (x, y + 2.35, z + math.cos(yaw) * 1.55), 0.42, 2.6, mat_metal,
            rot=(math.radians(-14), yaw, 0), verts=10)


ciws("CIWS_Aft", 0, 14.3, -45.5)
ciws("CIWS_Fwd", 0, L04 + 1.5, 8.4, yaw=math.pi)
# Explicit empties: the mesh-merge pass below renames meshes to SS_<Material>, so
# CrewedShip._extractMountPoints (which matches names starting with "CIWS") can no
# longer find the mounts on the geometry itself.
add_empty("CIWS_Fwd", (0, L04 + 4.7, 8.4))
add_empty("CIWS_Aft", (0, 17.5, -45.5))

# Mk 32 triple torpedo tubes, RHIBs, life rafts on the 01 level
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    add_box(f"TorpedoTubes_{tag}", (side * 8.4, L01 + 0.75, -6.0), (1.7, 1.6, 4.4), mat_metal, 0.10,
            rot=(0, math.radians(side * 26), 0), uv=3.0)
    add_box(f"RHIB_{tag}", (side * 9.0, DECK_Y + 1.55, 6.0), (2.5, 1.5, 7.2), mat_super, 0.14, uv=4.0)
    add_box(f"RHIB_Davit_{tag}", (side * 9.6, DECK_Y + 3.4, 6.0), (0.24, 3.2, 0.24), mat_metal, 0, uv=0)
    for i, z in enumerate([18.0, -14.0, -24.0]):
        add_box(f"LifeRaft_{tag}_{i}", (side * 9.55, L01 - 1.0, z), (0.75, 0.75, 1.7),
                mat_super, 0.08, uv=0)
    # Nixie / towed array housing at the transom
    add_box(f"Nixie_{tag}", (side * 3.2, DECK_Y + 0.9, -76.4), (1.5, 1.4, 2.0), mat_metal, 0.06, uv=0)

# Forecastle + flight-deck lifelines. The rail is chopped into short segments that
# each sit on the local deck-edge half-beam — a single straight rail box sticks out
# through the flared bow plating.
def lifeline(tag, z0, z1, side, n=12, inset=0.55):
    for k in range(n):
        z = z0 + (z1 - z0) * (k / (n - 1.0))
        add_box(f"Stanch_{tag}_{k}", (side * (deck_hw(z) - inset), sheer(z) + 0.62, z),
                (0.09, 1.24, 0.09), mat_metal, 0, uv=0, smooth=False)
    for k in range(n - 1):
        za = z0 + (z1 - z0) * (k / (n - 1.0))
        zb = z0 + (z1 - z0) * ((k + 1) / (n - 1.0))
        zc = (za + zb) * 0.5
        yaw = math.atan2((deck_hw(zb) - deck_hw(za)) * side, zb - za)
        add_box(f"Rail_{tag}_{k}", (side * (deck_hw(zc) - inset), sheer(zc) + 1.18, zc),
                (0.10, 0.10, abs(zb - za) * 1.05), mat_metal, 0, rot=(0, -yaw, 0),
                uv=0, smooth=False)


for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    lifeline(f"Fore_{tag}", 33.0, 73.5, side, n=14)
    lifeline(f"Aft_{tag}", -58.0, -76.0, side, n=8)
    for k in range(13):
        z = 33.0 + k * 3.1
        if z > 73.0:
            break
        add_box(f"ForeLowStanch_{tag}_{k}", (side * (deck_hw(z) - 0.48), sheer(z) + 0.38, z),
                (0.07, 0.72, 0.07), mat_metal, 0, uv=0, smooth=False)

# ---- superstructure surface detail: doors, vents, level break strips ----------
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    for i, z in enumerate([24.0, 14.0, 2.0, -12.0, -24.0]):
        add_box(f"SSDoor_{tag}_{i}", (side * 9.16, DECK_Y + 1.95, z), (0.16, 2.10, 0.95),
                mat_metal, 0.02, uv=0, smooth=False)
    for i, z in enumerate([20.0, 8.0, -6.0, -20.0]):
        add_box(f"SSVent_{tag}_{i}", (side * 8.80, L01 + 1.5, z), (0.34, 1.5, 2.6),
                mat_metal, 0.05, uv=0)
    for i, (y, z0, z1, hw) in enumerate([
        (L01 + 0.12, -30.0, 30.0, 8.95),
        (L02 + 0.12, -28.0, 29.0, 8.55),
    ]):
        add_box(f"SSBreak_{tag}_{i}", (side * hw, y, (z0 + z1) * 0.5), (0.22, 0.20, z1 - z0),
                mat_metal, 0, uv=0, smooth=False)
        for k in range(11):
            z = z0 + (z1 - z0) * k / 10.0
            add_box(f"SSRail_{tag}_{i}_{k}", (side * hw, y + 0.62, z), (0.08, 1.05, 0.08),
                    mat_metal, 0, uv=0, smooth=False)
        add_box(f"SSRailTop_{tag}_{i}", (side * hw, y + 1.16, (z0 + z1) * 0.5),
                (0.09, 0.09, z1 - z0), mat_metal, 0, uv=0, smooth=False)


# Surface greebles + deck furniture
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    add_box(f"CableTray_{tag}", (side * 8.55, L02 + 0.4, -8.0), (0.42, 0.55, 38.0), mat_metal, 0.05, uv=0)
    for i, z in enumerate([18.0, 4.0, -10.0, -22.0]):
        add_box(f"PipeRun_{tag}_{i}", (side * 8.72, L01 + 2.2 + (i % 2) * 0.6, z),
                (0.18, 0.18, 5.5), mat_metal, 0.03, uv=0)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.95, location=(4.2, 33.2, 11.5), segments=14, ring_count=8)
sat1 = bpy.context.active_object
sat1.name = "SATCOM_DomeA"
sat1.data.materials.append(mat_radome)
shade_smooth(sat1, 45)
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.72, location=(-3.8, 32.4, -14.0), segments=12, ring_count=7)
sat2 = bpy.context.active_object
sat2.name = "SATCOM_DomeB"
sat2.data.materials.append(mat_radome)
shade_smooth(sat2, 45)
add_cyl("FlagStaff", (0, 41.8, -74.5), 0.06, 8.0, mat_metal, rot=(math.radians(82), 0, 0), verts=8, bevel_w=0)
for i, z in enumerate([66.0, 54.0, -54.0, -68.0]):
    for side in (-1, 1):
        tag = "S" if side > 0 else "P"
        x = side * (deck_hw(z) - 1.85)
        add_cyl(f"Bitt_{tag}_{i}a", (x - 0.32, sheer(z) + 0.5, z), 0.2, 0.85,
                mat_metal, rot=(math.radians(90), 0, 0), verts=8, bevel_w=0)
        add_cyl(f"Bitt_{tag}_{i}b", (x + 0.32, sheer(z) + 0.5, z), 0.2, 0.85,
                mat_metal, rot=(math.radians(90), 0, 0), verts=8, bevel_w=0)

# --------------------------------------------------------------------------
# Mount points (names are contract with CrewedShip._extractMountPoints)
# --------------------------------------------------------------------------
# Co-located with BridgeInterior.js's own helm/weapons consoles — the GLB empties
# override the interior's values in the mountPoints merge.
add_empty("Helm", (0.0, 20.88, 12.90))
add_empty("WeaponsStation", (-6.51, 20.88, 10.28))

# ---- merge by material -------------------------------------------------------
# ~350 separate primitives means ~350 draw calls and a fat GLB. Nothing in the
# runtime looks the hero's meshes up by name (CrewedShip._reconcileWithBridgeInterior
# early-returns for hullKind 'hero'), only the empties, so collapse each material
# into one mesh. Hull keeps its own multi-material mesh.
KEEP_SEPARATE = {"Hull"}
groups = {}
for obj in list(scene.objects):
    if obj.type != "MESH" or obj.name in KEEP_SEPARATE:
        continue
    if not obj.data.materials:
        continue
    key = obj.data.materials[0].name
    groups.setdefault(key, []).append(obj)

for mat_name, objs in groups.items():
    if len(objs) < 2:
        objs[0].name = f"SS_{mat_name}"
        continue
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    try:
        bpy.ops.object.join()
        bpy.context.view_layer.objects.active.name = f"SS_{mat_name}"
    except Exception:
        pass
bpy.ops.object.select_all(action="DESELECT")

# The runtime pokes Bridge_Glass by name to force it visible; keep that name alive.
glass_grp = bpy.data.objects.get(f"SS_{mat_glass.name}")
if glass_grp:
    glass_grp.name = "Bridge_Glass"

bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 0, 0))
root = bpy.context.active_object
root.name = "Meridian_Burke"
for obj in list(scene.objects):
    if obj != root and obj.type in {"MESH", "EMPTY"} and obj.parent is None:
        obj.parent = root

tris = 0
for o in scene.objects:
    if o.type == "MESH" and o.data:
        o.data.calc_loop_triangles()
        tris += len(o.data.loop_triangles)

OUT.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=str(OUT), export_format="GLB", use_selection=False,
    export_apply=True, export_yup=True,
)
OUT_MIRROR.parent.mkdir(parents=True, exist_ok=True)
shutil.copyfile(OUT, OUT_MIRROR)
print(f"EXPORTED {OUT} (+ src mirror) tris={tris} objs={len(scene.objects)} "
      f"LOA={LOA} BEAM={BEAM} mast_truck=46m bridge={L03}-{L04}m")
