"""
MV KESTREL BAY — neutral general-cargo / container merchant vessel.

SOURCE OF TRUTH for public/assets/models/merchant_ship.glb.
Never hand-edit the .glb — change this and re-run:

  /Applications/Blender.app/Contents/MacOS/Blender --background \
    --python scripts/blender/build_merchant_ship.py

AXIS CONVENTION (identical to build_escort_ffg.py — read that file's export
note before touching anything here):
  authored Y-up, bow = +Z, starboard = +X, waterline = Y 0, centred on X=0/Z=0.
  The whole hierarchy is rotated +90 deg about Blender X on the root right
  before export, which is what makes the exported GLB come out bow=+Z / up=+Y
  in glTF space so the runtime loader needs NO reconciling rotation. This
  matches escort_hull.glb (see src/entities/EnemyShip.js:64) and is what
  src/entities/MerchantShip.js's `_tryLoadBlenderHull` relies on.

Unlike the combatant hulls this ship is UNARMED scenery — it is inspected at
medium range through the Lookout station's binoculars, so the budget goes into
silhouette and surface story (plating seams, rust runs, cargo gear, containers,
railings) rather than weapon fits.

Silhouette targets (handysize general cargo / feeder box ship, LOA 150 m,
beam 21 m, main deck 9.5 m above the waterline — these three numbers are a
contract with src/entities/geometryKits.js `buildMerchantShipMesh`, whose
procedural placeholder is shown until this GLB finishes loading):
  bulbous bow -> raked stem + forecastle with windlasses and foremast ->
  four hatch coamings with pontoon covers, two of them loaded with containers
  -> three pedestal deck cranes on the centreline -> five-tier accommodation
  block aft with bridge wings out to the ship's full beam -> raked funnel with
  a smokestack cap -> mooring deck -> transom with skeg, rudder and screw.

Paint scheme is deliberately warm and civilian so it never reads as a
combatant at a glance: red-oxide topsides, cream sheer strake and upperworks,
black boot topping, red antifouling.

Materials are real PBR: per-family base-colour maps plus ONE shared
roughness/metallic pack and ONE shared normal map, all tileable and projected
at world scale (a 0..1 UV tile is a fixed number of metres), so plating seams
stay a constant physical size over a 150 m hull.
"""
from __future__ import annotations

import math
import shutil
from pathlib import Path

import bmesh
import bpy
import numpy as np

ROOT = Path("/Users/tje/games/warship")
OUT = ROOT / "public/assets/models/merchant_ship.glb"
OUT_MIRROR = ROOT / "src/assets/models/merchant_ship.glb"

LOA, BEAM, DECK_Y = 150.0, 21.0, 9.5
HALF = LOA * 0.5
KEEL = -8.0                      # moulded bottom below the waterline

# Accommodation block deck heights above the waterline (metres).
A_DECK = 12.8
B_DECK = 15.7
C_DECK = 18.6
D_DECK = 21.5
BRIDGE_TOP = 25.2
MONKEY = 26.0
DH_AFT, DH_FWD = -58.0, -36.0

TEX = 512                        # texture resolution (all maps)

bpy.ops.wm.read_factory_settings(use_empty=True)
for obj in list(bpy.data.objects):
    bpy.data.objects.remove(obj, do_unlink=True)
for mesh in list(bpy.data.meshes):
    bpy.data.meshes.remove(mesh)
for mat in list(bpy.data.materials):
    bpy.data.materials.remove(mat)
for img in list(bpy.data.images):
    if img.users == 0:
        bpy.data.images.remove(img)

scene = bpy.context.scene


# --------------------------------------------------------------------------
# colour helpers
# --------------------------------------------------------------------------
def srgb_to_linear(c):
    return tuple(((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c)


def hexc(s):
    s = s.lstrip("#")
    return srgb_to_linear(tuple(int(s[i:i + 2], 16) / 255.0 for i in (0, 2, 4)))


# --------------------------------------------------------------------------
# procedural, seamlessly TILEABLE texture generation
# --------------------------------------------------------------------------
def tile_noise(h, w, cells, seed):
    """Value noise on a wrapping lattice -> tiles seamlessly in both axes."""
    rng = np.random.default_rng(seed)
    cells = max(2, int(cells))
    g = rng.random((cells, cells)).astype(np.float32)
    ys = np.linspace(0, cells, h, endpoint=False, dtype=np.float32)
    xs = np.linspace(0, cells, w, endpoint=False, dtype=np.float32)
    y0 = np.floor(ys).astype(int)
    x0 = np.floor(xs).astype(int)
    ty = (ys - y0)[:, None]
    tx = (xs - x0)[None, :]
    y1 = (y0 + 1) % cells
    x1 = (x0 + 1) % cells
    y0 %= cells
    x0 %= cells
    a = g[y0[:, None], x0[None, :]]
    b = g[y0[:, None], x1[None, :]]
    c = g[y1[:, None], x0[None, :]]
    d = g[y1[:, None], x1[None, :]]
    u = tx * tx * (3 - 2 * tx)
    v = ty * ty * (3 - 2 * ty)
    return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v


def fbm(h, w, cells, octaves, seed):
    out = np.zeros((h, w), dtype=np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        out += tile_noise(h, w, cells * (2 ** o), seed + o * 37) * amp
        tot += amp
        amp *= 0.52
    return out / tot


def plating(n, strakes=5, butts=3, seed=7):
    """Steel plating layout for one texture tile.

    Returns (seam, plate_id_v, plate_id_u, panel) where `seam` is a soft mask of
    weld lines (horizontal strake seams + staggered vertical butt joints) and
    `panel` is a low-frequency per-plate value used to give each plate its own
    tiny colour/flatness offset — the thing that actually makes a steel hull read
    as fabricated rather than injection-moulded.
    """
    vv, uu = np.mgrid[0:n, 0:n].astype(np.float32)
    vv /= n
    uu /= n
    rng = np.random.default_rng(seed)

    seam = np.zeros((n, n), dtype=np.float32)
    # horizontal strake seams (constant v)
    for k in range(strakes):
        y = k / strakes
        d = np.abs(((vv - y + 0.5) % 1.0) - 0.5)
        seam = np.maximum(seam, np.exp(-(d ** 2) / (2 * 0.0016 ** 2)))
    # vertical butt joints, staggered half a bay on alternate strakes
    strake_idx = np.floor(vv * strakes).astype(int)
    for k in range(butts):
        for parity in (0, 1):
            x = (k + 0.5 * parity) / butts
            d = np.abs(((uu - x + 0.5) % 1.0) - 0.5)
            line = np.exp(-(d ** 2) / (2 * 0.0014 ** 2))
            seam = np.maximum(seam, line * ((strake_idx % 2) == parity))

    pid = strake_idx * 977 + np.floor(uu * butts).astype(int) * 31
    panel = (np.sin(pid.astype(np.float32) * 1.7) * 0.5 + 0.5)
    panel = panel * 0.6 + fbm(n, n, 4, 3, seed + 5) * 0.4
    return seam, panel


def make_image(name, arr, non_color=False):
    h, w = arr.shape[:2]
    if arr.shape[2] == 3:
        arr = np.concatenate([arr, np.ones((h, w, 1), dtype=np.float32)], axis=2)
    img = bpy.data.images.new(name, w, h, alpha=False)
    # Colorspace MUST be set before the pixel write: assigning it re-derives the
    # image buffer from the (blank, generated) source, which silently threw away
    # everything written beforehand and exported a solid-black normal/ORM map.
    if non_color:
        img.colorspace_settings.name = "Non-Color"
    img.pixels.foreach_set(np.clip(arr, 0.0, 1.0).astype(np.float32).ravel())
    img.update()
    img.pack()
    return img


N = TEX
SEAM, PANEL = plating(N, strakes=5, butts=3, seed=7)
MICRO = fbm(N, N, 10, 3, 21)
DENTS = fbm(N, N, 3, 3, 33)
VV = np.mgrid[0:N, 0:N][0].astype(np.float32) / N


def rust_streaks(seed, count=26, strength=1.0):
    """Vertical wash/rust runs. In Blender image space V increases upward, so a
    streak that fades with increasing V runs *down* the hull from a fitting."""
    rng = np.random.default_rng(seed)
    uu = np.mgrid[0:N, 0:N][1].astype(np.float32) / N
    out = np.zeros((N, N), dtype=np.float32)
    wobble = (fbm(N, N, 6, 3, seed + 2) - 0.5) * 0.03
    for _ in range(count):
        x = float(rng.uniform(0, 1))
        w = float(rng.uniform(0.002, 0.010))
        top = float(rng.uniform(0.15, 1.0))
        run = float(rng.uniform(0.12, 0.55))
        d = np.abs(((uu + wobble - x + 0.5) % 1.0) - 0.5)
        col = np.exp(-(d ** 2) / (2 * w ** 2))
        fall = np.clip((top - VV) / run, 0.0, 1.0) * (VV < top)
        out = np.maximum(out, col * fall * float(rng.uniform(0.35, 1.0)))
    out = out * (0.55 + 0.45 * fbm(N, N, 12, 3, seed + 9))
    return np.clip(out * strength, 0, 1)


HULL_STREAK = rust_streaks(101, 30, 1.0)
UPPER_STREAK = rust_streaks(202, 18, 0.85)
RUST_PATCH = np.clip((fbm(N, N, 5, 4, 55) - 0.56) * 4.2, 0, 1)

RUST_COL = np.array(hexc("6B3418"), dtype=np.float32)
DARK_RUST = np.array(hexc("3A1D0E"), dtype=np.float32)
SALT = np.array(hexc("BFC4C6"), dtype=np.float32)


def paint_color_map(name, hex_base, streak, streak_mix=0.55, patch_mix=0.5,
                    salt_mix=0.10, panel_var=0.05):
    base = np.array(hexc(hex_base), dtype=np.float32)
    rgb = np.tile(base, (N, N, 1)).astype(np.float32)
    # per-plate paint value variation + touch-up patches
    rgb *= (1.0 + (PANEL - 0.5)[..., None] * panel_var * 2.0)
    # weld seams read as a slightly darker recessed line. Kept low-contrast on
    # purpose: at 0.28 combined with the per-plate value variation the topsides
    # read as a brick wall rather than welded steel plating.
    rgb *= 1.0 - SEAM[..., None] * 0.16
    # broad rust blooms
    m = (RUST_PATCH * patch_mix)[..., None]
    rgb = rgb * (1 - m) + RUST_COL * m
    # directional rust runs (dark core, lighter halo)
    s = (streak * streak_mix)[..., None]
    rgb = rgb * (1 - s) + DARK_RUST * s * 0.55 + RUST_COL * s * 0.45
    # salt bloom near the top of the tile
    sa = (np.clip(VV - 0.55, 0, 1) * MICRO * salt_mix)[..., None]
    rgb = rgb * (1 - sa) + SALT * sa
    rgb *= 0.94 + MICRO[..., None] * 0.12
    return make_image(name, np.clip(rgb, 0, 1))


def orm_map(name):
    """G = roughness, B = metallic (the glTF metallicRoughness packing)."""
    rough = 0.63 + (MICRO - 0.5) * 0.16 + SEAM * 0.10 + RUST_PATCH * 0.16
    rough += HULL_STREAK * 0.08 + (PANEL - 0.5) * 0.05
    rough = np.clip(rough, 0.34, 0.94)
    metal = np.clip(0.06 + RUST_PATCH * 0.10, 0, 1)
    arr = np.stack([np.ones_like(rough), rough, metal], axis=2)
    return make_image(name, arr, non_color=True)


def normal_map(name):
    h = (SEAM * 0.55                      # proud weld beads
         + (PANEL - 0.5) * 0.10           # plate flatness / oil-canning
         + (DENTS - 0.5) * 0.22           # shell dents
         + (MICRO - 0.5) * 0.05
         + RUST_PATCH * 0.10)             # scabbed rust
    p = np.pad(h, 1, mode="wrap")
    dx = (p[1:-1, 2:] - p[1:-1, :-2]) * 3.4
    dy = (p[2:, 1:-1] - p[:-2, 1:-1]) * 3.4
    n = np.stack([-dx, -dy, np.ones_like(dx)], axis=2)
    n /= np.maximum(np.linalg.norm(n, axis=2, keepdims=True), 1e-5)
    return make_image(name, (n * 0.5 + 0.5).astype(np.float32), non_color=True)


IMG_ORM = orm_map("MV_ORM")
IMG_NRM = normal_map("MV_NRM")
IMG_HULL = paint_color_map("MV_COL_hull", "AE5027", HULL_STREAK, 0.42, 0.26, 0.12, 0.028)
IMG_CREAM = paint_color_map("MV_COL_cream", "DCD5C0", UPPER_STREAK, 0.40, 0.18, 0.06, 0.026)
IMG_DECK = paint_color_map("MV_COL_deck", "58604F", HULL_STREAK, 0.40, 0.52, 0.05, 0.07)
IMG_HATCH = paint_color_map("MV_COL_hatch", "7C7970", UPPER_STREAK, 0.36, 0.38, 0.05, 0.08)


# --------------------------------------------------------------------------
# materials
# --------------------------------------------------------------------------
def textured_mat(name, col_img, uv_scale=1.0, rough_boost=0.0, normal_strength=1.0):
    """Principled BSDF wired in the exact pattern the glTF exporter recognises:
    base-colour image -> Base Color, one packed image -> Separate Color -> G/B
    into Roughness/Metallic (exports as a single metallicRoughnessTexture), and
    an image -> Normal Map -> Normal."""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]

    texco = nt.nodes.new("ShaderNodeTexCoord")
    texco.location = (-1200, 0)
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.location = (-1000, 0)
    mapping.inputs["Scale"].default_value = (uv_scale, uv_scale, 1.0)

    nt.links.new(texco.outputs["UV"], mapping.inputs["Vector"])

    col = nt.nodes.new("ShaderNodeTexImage")
    col.image = col_img
    col.location = (-760, 300)
    nt.links.new(mapping.outputs["Vector"], col.inputs["Vector"])
    nt.links.new(col.outputs["Color"], bsdf.inputs["Base Color"])

    orm = nt.nodes.new("ShaderNodeTexImage")
    orm.image = IMG_ORM
    orm.location = (-760, 0)
    nt.links.new(mapping.outputs["Vector"], orm.inputs["Vector"])
    sep = nt.nodes.new("ShaderNodeSeparateColor")
    sep.location = (-480, 0)
    nt.links.new(orm.outputs["Color"], sep.inputs["Color"])
    nt.links.new(sep.outputs["Green"], bsdf.inputs["Roughness"])
    nt.links.new(sep.outputs["Blue"], bsdf.inputs["Metallic"])

    nrm = nt.nodes.new("ShaderNodeTexImage")
    nrm.image = IMG_NRM
    nrm.location = (-760, -320)
    nt.links.new(mapping.outputs["Vector"], nrm.inputs["Vector"])
    nmap = nt.nodes.new("ShaderNodeNormalMap")
    nmap.location = (-480, -320)
    nmap.inputs["Strength"].default_value = normal_strength
    nt.links.new(nrm.outputs["Color"], nmap.inputs["Color"])
    nt.links.new(nmap.outputs["Normal"], bsdf.inputs["Normal"])
    return mat


def flat_mat(name, color, roughness=0.55, metallic=0.1, emission=None, strength=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    b = mat.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1.0)
    b.inputs["Roughness"].default_value = roughness
    b.inputs["Metallic"].default_value = metallic
    if emission is not None:
        b.inputs["Emission Color"].default_value = (*emission, 1.0)
        b.inputs["Emission Strength"].default_value = strength
    return mat


mat_hull = textured_mat("MV_HullPaint", IMG_HULL, 1.0, normal_strength=1.0)
mat_cream = textured_mat("MV_CreamPaint", IMG_CREAM, 1.35, normal_strength=0.75)
mat_deck = textured_mat("MV_DeckPaint", IMG_DECK, 1.6, normal_strength=0.9)
mat_hatch = textured_mat("MV_HatchSteel", IMG_HATCH, 1.9, normal_strength=1.0)

mat_boot = flat_mat("MV_BootTop", hexc("15181B"), 0.72, 0.05)
mat_anti = flat_mat("MV_Antifoul", hexc("6E241B"), 0.86, 0.03)
mat_metal = flat_mat("MV_DarkMetal", hexc("2E3338"), 0.45, 0.70)
mat_steel = flat_mat("MV_BareSteel", hexc("6A6E72"), 0.38, 0.85)
mat_funnel = flat_mat("MV_FunnelRed", hexc("7C2B26", ), 0.62, 0.06)
mat_black = flat_mat("MV_FunnelBlack", hexc("1A1B1D"), 0.68, 0.08)
mat_glass = flat_mat("MV_Glass", hexc("101A20"), 0.10, 0.30)
mat_orange = flat_mat("MV_Rescue", hexc("D2591A"), 0.55, 0.04)
mat_white = flat_mat("MV_WhitePaint", hexc("D6D4CB"), 0.55, 0.04)
mat_teak = flat_mat("MV_Timber", hexc("6B5233"), 0.80, 0.02)

# Shipping-line liveries. Weighted toward the duller corporate reds/blues/greys
# that dominate a real container stack — the brighter ochre/plum are deliberately
# rare so they read as the occasional odd box rather than as a colour wheel.
CONTAINER_HEX = [
    "9B3A2E", "9B3A2E", "2C5A7E", "2C5A7E", "8A8C90", "8A8C90",
    "3E6B45", "7A4038", "B5842A", "6D3D6B",
]
mat_boxes = [flat_mat(f"MV_Box{i}", hexc(h), 0.66, 0.12) for i, h in enumerate(CONTAINER_HEX)]


def _box_mat(idx, tier, row):
    """Pick a container livery pseudo-randomly rather than by marching through the
    palette. The previous `(idx*7 + tier*3 + row) % len(...)` stepped by exactly one
    per athwartships row, so every stack ran the same colours in the same order and
    the deck read as a repeating rainbow. Hashing the position decorrelates
    neighbours while staying fully deterministic, so the export is reproducible."""
    h = (idx * 73856093) ^ (tier * 19349663) ^ (row * 83492791)
    h = (h ^ (h >> 13)) * 1274126177 & 0xFFFFFFFF
    return mat_boxes[(h >> 7) % len(mat_boxes)]

HULL_MATS = [mat_hull, mat_deck, mat_boot, mat_anti, mat_cream]  # slot indices 0..4


# --------------------------------------------------------------------------
# mesh helpers (same idioms as build_arleigh_burke.py / build_escort_ffg.py)
# --------------------------------------------------------------------------
def link(obj):
    scene.collection.objects.link(obj)
    return obj


def mesh_from_bmesh(name, bm):
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    return link(bpy.data.objects.new(name, mesh))


def bevel(obj, width=0.05, segments=2, angle=32):
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
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = dim
    if rot:
        obj.rotation_euler = rot
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    # Browser budget: a 2-segment bevel roughly triples a cube's face count, and
    # this ship is mostly small greebles. Only the wide structural bevels (where
    # the rounded corner is actually readable) get the second segment.
    bevel(obj, bevel_w, 2 if bevel_w >= 0.09 else 1)
    if smooth:
        shade_smooth(obj)
    if uv:
        uv_cube(obj, uv)
    return obj


# Blender's cylinder/cone primitives are built along Blender's +Z. In THIS file's
# authoring space Blender Z is the ship's fore-and-aft axis, so an un-rotated
# cylinder lies down the length of the ship — which is how the foremast, the
# funnel uptakes and every crane pedestal ended up on their sides in the first
# pass. Always say which ship axis you want:
#   "Y" = vertical (masts, uptakes, bollards)   <- the default, it is what you want
#   "Z" = fore-and-aft (propeller shaft, stowed canisters)
#   "X" = athwartships (winch and windlass drums)
_AXIS_ROT = {
    "Y": (math.radians(90), 0.0, 0.0),
    "Z": None,
    "X": (0.0, math.radians(90), 0.0),
}


def add_cyl(name, loc, radius, depth, mat, axis="Y", verts=16, bevel_w=0.03,
            smooth=True, uv=0.0, radius2=None):
    rot = _AXIS_ROT[axis]
    if radius2 is None:
        bpy.ops.mesh.primitive_cylinder_add(radius=radius, depth=depth, location=loc, vertices=verts)
    else:
        bpy.ops.mesh.primitive_cone_add(radius1=radius, radius2=radius2, depth=depth,
                                        location=loc, vertices=verts)
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
    if uv:
        uv_cube(obj, uv)
    return obj


def add_sphere(name, loc, radius, mat, scale=(1, 1, 1), segs=16, rings=9):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=radius, location=loc, segments=segs, ring_count=rings)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(scale=True)
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    shade_smooth(obj, 45)
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
               bevel_w=0.10, cap_bottom=True, uv=8.0, smooth_angle=24):
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


def rounded_plan(z_aft, z_fwd, hw, corner=1.4):
    """Deckhouse plan with softened corners — merchant houses are boxier than a
    warship's faceted RCS deckhouse, but never a razor-edged cube."""
    return [
        (hw - corner, z_fwd), (hw, z_fwd - corner),
        (hw, z_aft + corner), (hw - corner, z_aft),
        (-(hw - corner), z_aft), (-hw, z_aft + corner),
        (-hw, z_fwd - corner), (-(hw - corner), z_fwd),
    ]


# --------------------------------------------------------------------------
# HULL — lofted stations. Full-form merchant section: flat bottom, hard bilge,
# near-vertical topsides, long parallel midbody, flared raked bow, transom.
# --------------------------------------------------------------------------
BOOT_TOP = 2.10             # top of the black boot topping above the waterline
CREAM_DROP = 2.60           # depth of the cream sheer strake below the deck edge

#   z,     hb_wl, hb_deck, bottom_y
STATIONS = [
    (-HALF,   7.30,  9.10, -4.60),   # transom
    (-70.0,   8.60,  9.90, -6.10),
    (-64.0,   9.55, 10.30, -7.10),
    (-56.0,  10.15, 10.48, -7.70),
    (-46.0,  10.45, 10.50, -7.95),
    (-30.0,  10.50, 10.50, -8.00),
    (-10.0,  10.50, 10.50, -8.00),
    (12.0,   10.50, 10.50, -8.00),
    (30.0,   10.46, 10.50, -8.00),
    (42.0,   10.08, 10.48, -7.90),
    (52.0,    9.05, 10.20, -7.35),
    (60.0,    7.35,  9.40, -6.45),
    (66.0,    5.25,  8.10, -5.10),
    (70.0,    3.25,  6.40, -3.30),
    (73.0,    1.55,  4.30, -0.90),
    (HALF,    0.45,  2.10,  1.55),
]


def sheer(z):
    """Main-deck height above the waterline. Classic merchant parabolic sheer —
    strong forward, gentler aft, flat over the parallel midbody."""
    t = z / HALF
    fwd = max(0.0, t)
    aft = max(0.0, -t)
    return DECK_Y + 2.95 * (fwd ** 2.1) + 1.15 * (aft ** 2.4)


def station_ring(z, hb_wl, hb_deck, ybot, ydeck):
    fb = ydeck
    flat = hb_wl * 0.60
    pts = [(0.0, ybot), (flat, ybot)]
    NB = 5
    for i in range(1, NB + 1):
        th = (i / NB) * (math.pi * 0.5)
        pts.append((flat + (hb_wl - flat) * math.sin(th),
                    ybot + (ybot * 0.52 - ybot) * (1.0 - math.cos(th))))
    pts.append((hb_wl * 0.998, ybot * 0.18))
    pts.append((hb_wl, 0.0))                       # waterline
    # Explicit rings AT the paint boundaries. Without these the per-face material
    # assignment (which tests each face's centre height) quantises to whatever the
    # loft happened to produce, and the black boot topping came out ~4 m tall
    # instead of 2.1 m because one face band straddled the whole lower topside.
    for y in (BOOT_TOP, fb * 0.55, fb - CREAM_DROP):
        t = max(0.0, min(1.0, y / max(fb, 1e-3)))
        pts.append((hb_wl + (hb_deck - hb_wl) * (t ** 0.72), y))
    pts.append((hb_deck * 0.998, fb * 0.88))       # sheer strake / flare
    pts.append((hb_deck, fb))                      # deck edge
    pts.append((hb_deck * 0.55, fb + 0.16))        # deck camber
    pts.append((0.0, fb + 0.26))
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

for f in bm.faces:
    c = f.calc_center_median()
    d = sheer(c.z)
    if f.normal.y > 0.55 and c.y > d - 1.2:
        f.material_index = 1                 # weather deck
    elif c.y < -0.30:
        f.material_index = 3                 # antifouling
    elif c.y < BOOT_TOP:
        f.material_index = 2                 # boot topping
    elif c.y > d - CREAM_DROP:
        f.material_index = 4                 # cream sheer strake
    else:
        f.material_index = 0                 # red-oxide topsides

hull = mesh_from_bmesh("Hull", bm)
for m in HULL_MATS:
    hull.data.materials.append(m)
bevel(hull, 0.06, 2, angle=36)
shade_smooth(hull, 32)
# World-scale box projection, NOT uv_smart: smart-project packs the whole 150 m
# hull into one 0..1 island, which stretches a single plating tile over the entire
# ship and reads as untextured flat paint. Cube projection keeps the plating a
# constant physical size and picks the right axis per face automatically.
uv_cube(hull, 9.0)


def deck_hw(z):
    z = max(STATIONS[0][0], min(STATIONS[-1][0], z))
    for i in range(len(STATIONS) - 1):
        z0, _, d0, _ = STATIONS[i]
        z1, _, d1, _ = STATIONS[i + 1]
        if z0 <= z <= z1:
            t = (z - z0) / (z1 - z0) if z1 > z0 else 0.0
            return d0 + (d1 - d0) * t
    return STATIONS[-1][2]


# ---- bulbous bow, skeg, rudder, screw ---------------------------------------
add_sphere("BulbousBow", (0, -4.6, 71.5), 2.5, mat_anti, scale=(0.82, 0.80, 2.35), segs=18, rings=10)
add_box("Skeg", (0, -6.6, -63.0), (1.6, 3.4, 20.0), mat_anti, 0.20, uv=6.0)
add_box("SternTube", (0, -5.2, -71.5), (1.5, 1.5, 7.0), mat_anti, 0.30, uv=4.0)
add_cyl("PropBoss", (0, -5.2, -75.6), 0.95, 2.2, mat_metal, axis="Z", verts=14)
for k in range(4):
    a = k * math.pi / 2 + 0.4
    add_box(f"PropBlade_{k}", (math.sin(a) * 1.9, -5.2 + math.cos(a) * 1.9, -75.8),
            (1.5, 3.0, 0.30), mat_metal, 0.10,
            rot=(0, math.radians(22), -a), uv=0)
add_box("RudderStock", (0, -3.0, -78.6), (0.9, 5.0, 1.0), mat_anti, 0.15, uv=0)
add_box("Rudder", (0, -4.6, -79.4), (0.85, 6.6, 4.6), mat_anti, 0.30, uv=4.0)


# --------------------------------------------------------------------------
# WEATHER DECK — bulwarks, forecastle, hatches, cranes, containers
# --------------------------------------------------------------------------
# Continuous low bulwark down both sides of the cargo deck, yawed to follow the
# sheer plan so it never pokes out through the flared bow plating.
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    for i in range(32):
        z0 = -74.0 + i * 4.9
        z1 = z0 + 4.9
        if z1 > 53.0:
            break
        zc = (z0 + z1) * 0.5
        yaw = math.atan2((deck_hw(z1) - deck_hw(z0)) * side, z1 - z0)
        add_box(f"Bulwark_{tag}_{i}", (side * (deck_hw(zc) - 0.16), sheer(zc) + 0.52, zc),
                (0.26, 1.10, (z1 - z0) * 1.06), mat_cream, 0.0, rot=(0, -yaw, 0), uv=5.0)
        if i % 3 == 0:
            add_box(f"BulwarkStay_{tag}_{i}", (side * (deck_hw(zc) - 0.55), sheer(zc) + 0.45, zc),
                    (0.72, 0.14, 0.14), mat_metal, 0, uv=0, smooth=False)

# ---- forecastle -------------------------------------------------------------
FC_AFT, FC_FWD = 52.0, 74.6
FC_RISE = 2.75


def fc_y(z):
    return sheer(z) + FC_RISE


fc_plan = []
for z in (FC_FWD, 71.0, 66.0, 60.0, FC_AFT):
    fc_plan.append((deck_hw(z) - 0.10, z))
fc_plan += [(-x, z) for (x, z) in reversed(fc_plan)]
poly_prism("Forecastle", fc_plan, sheer(58.0) - 0.6, 0.0, mat_hull, uv=7.0)  # placeholder y, fixed below
bpy.data.objects.remove(bpy.data.objects["Forecastle"], do_unlink=True)

# Build the forecastle as a swept deck slab so its top follows the sheer.
bm = bmesh.new()
zs = [FC_AFT, 57.0, 62.0, 66.5, 70.5, 73.0, FC_FWD]
low, up = [], []
for z in zs:
    hw = deck_hw(z) - 0.12
    y1 = fc_y(z)
    y0 = sheer(z) - 0.25
    low.append((bm.verts.new((-hw, y0, z)), bm.verts.new((hw, y0, z))))
    up.append((bm.verts.new((-hw, y1, z)), bm.verts.new((hw, y1, z))))
for i in range(len(zs) - 1):
    lp, ln = low[i], low[i + 1]
    up_, un = up[i], up[i + 1]
    bm.faces.new((up_[0], up_[1], un[1], un[0]))          # deck top
    bm.faces.new((lp[0], ln[0], un[0], up_[0]))           # port side
    bm.faces.new((lp[1], up_[1], un[1], ln[1]))           # stbd side
bm.faces.new((low[0][0], low[0][1], up[0][1], up[0][0]))  # aft face (break)
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
fc = mesh_from_bmesh("ForecastleDeck", bm)
fc.data.materials.append(mat_deck)
bevel(fc, 0.06, 2)
shade_smooth(fc, 30)
uv_cube(fc, 7.0)

# forecastle bulwark, taller and solid (breaks green water on the bow)
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    for i in range(9):
        z0 = FC_AFT + i * 2.55
        z1 = z0 + 2.55
        if z1 > FC_FWD:
            z1 = FC_FWD
        zc = (z0 + z1) * 0.5
        yaw = math.atan2((deck_hw(z1) - deck_hw(z0)) * side, z1 - z0)
        add_box(f"FCBulwark_{tag}_{i}", (side * (deck_hw(zc) - 0.30), fc_y(zc) + 0.72, zc),
                (0.24, 1.45, (z1 - z0) * 1.06), mat_cream, 0.0, rot=(0, -yaw, 0), uv=5.0)
add_box("FCBulwarkStem", (0, fc_y(74.0) + 0.72, 74.2), (3.4, 1.45, 0.24), mat_cream, 0.0, uv=4.0)

# windlasses / chain stoppers / anchors
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    add_box(f"Windlass_{tag}", (side * 3.4, fc_y(66.0) + 0.85, 66.0), (3.0, 1.7, 2.4),
            mat_metal, 0.10, uv=3.0)
    add_cyl(f"WildcatDrum_{tag}", (side * 5.1, fc_y(66.0) + 0.95, 66.0), 0.85, 1.1, mat_steel,
            axis="X", verts=14)
    add_cyl(f"WarpingHead_{tag}", (side * 1.9, fc_y(66.0) + 1.15, 66.0), 0.55, 1.4, mat_steel,
            axis="Y", verts=12)
    for k in range(9):
        z = 67.6 + k * 0.85
        add_box(f"ChainLink_{tag}_{k}", (side * (4.6 - k * 0.16), fc_y(z) + 0.16, z),
                (0.34, 0.30, 0.62), mat_metal, 0.06, uv=0, smooth=False)
    add_box(f"HawsePipe_{tag}", (side * 3.9, fc_y(71.0) + 0.10, 71.6), (1.5, 0.9, 1.9),
            mat_metal, 0.15, uv=0)
    # stockless anchor stowed in the hawse
    add_box(f"Anchor_{tag}", (side * (deck_hw(69.0) - 0.05), sheer(69.0) - 2.1, 69.2),
            (0.45, 2.4, 1.6), mat_metal, 0.12, uv=0)
    add_box(f"AnchorStock_{tag}", (side * (deck_hw(69.0) + 0.05), sheer(69.0) - 3.1, 69.2),
            (0.30, 1.0, 2.8), mat_metal, 0.10, uv=0)
    add_box(f"FCVent_{tag}", (side * 6.4, fc_y(58.5) + 1.1, 58.5), (1.0, 2.2, 1.0), mat_cream, 0.10, uv=3.0)

add_box("ChainLocker", (0, fc_y(61.5) + 0.55, 61.5), (5.0, 1.1, 3.2), mat_cream, 0.10, uv=4.0)
add_box("Bullnose", (0, fc_y(74.0) - 0.10, 74.3), (1.9, 0.9, 1.3), mat_metal, 0.14, uv=0)

# foremast on the forecastle
add_cyl("Foremast", (0, fc_y(57.5) + 6.5, 57.5), 0.42, 13.0, mat_cream, verts=12, radius2=0.28)
add_box("ForemastYard", (0, fc_y(57.5) + 8.2, 57.5), (4.4, 0.16, 0.26), mat_cream, 0.03, uv=0)
add_box("ForemastPlatform", (0, fc_y(57.5) + 8.6, 57.5), (1.8, 0.14, 1.4), mat_cream, 0.03, uv=0)
add_box("ForemastLight", (0, fc_y(57.5) + 11.9, 57.5), (0.48, 0.66, 0.48), mat_white, 0.05, uv=0)
for side in (-1, 1):
    add_box(f"ForemastStay_{'S' if side > 0 else 'P'}", (side * 1.6, fc_y(57.5) + 3.6, 57.5),
            (0.10, 7.6, 0.10), mat_metal, 0, rot=(0, 0, math.radians(side * 9)), uv=0, smooth=False)
add_cyl("Jackstaff", (0, fc_y(74.0) + 2.6, 74.0), 0.09, 5.0, mat_white, verts=8, bevel_w=0)


# ---- cargo hatches ----------------------------------------------------------
HATCH_HW = 7.55
HATCHES = [
    # (z_centre, half length, container tiers)
    (43.0, 8.0, 2),
    (23.0, 8.6, 0),
    (2.0, 8.6, 3),
    (-19.0, 8.6, 0),
]
COAM_H = 1.95        # coaming height above the deck
COVER_T = 0.55


def hatch(idx, zc, hl, tiers):
    d = sheer(zc)
    poly_prism(f"HatchCoaming_{idx}",
               [(HATCH_HW, zc + hl), (HATCH_HW, zc - hl),
                (-HATCH_HW, zc - hl), (-HATCH_HW, zc + hl)],
               d - 0.20, d + COAM_H, mat_cream, bevel_w=0.08, uv=6.0)
    top = d + COAM_H
    # pontoon covers — three panels with visible joints, sitting proud of the coaming
    n = 3
    for p in range(n):
        pz = zc - hl + (2 * hl) * ((p + 0.5) / n)
        add_box(f"HatchCover_{idx}_{p}", (0, top + COVER_T * 0.5, pz),
                (HATCH_HW * 2 + 0.45, COVER_T, (2 * hl / n) * 0.965), mat_hatch, 0.05, uv=5.0)
        for side in (-1, 1):
            add_box(f"HatchCleat_{idx}_{p}_{'S' if side > 0 else 'P'}",
                    (side * (HATCH_HW + 0.28), top + 0.16, pz),
                    (0.22, 0.30, (2 * hl / n) * 0.7), mat_metal, 0, uv=0, smooth=False)
    # transverse stiffener ribs on the covers
    for r in range(7):
        rz = zc - hl + (2 * hl) * (r + 0.5) / 7.0
        add_box(f"HatchRib_{idx}_{r}", (0, top + COVER_T + 0.06, rz),
                (HATCH_HW * 2 - 0.4, 0.13, 0.20), mat_metal, 0, uv=0, smooth=False)
    # coaming brackets
    for side in (-1, 1):
        for k in range(6):
            bz = zc - hl + (2 * hl) * (k + 0.5) / 6.0
            add_box(f"CoamBracket_{idx}_{side}_{k}", (side * (HATCH_HW + 0.30), d + 0.55, bz),
                    (0.62, 0.90, 0.16), mat_cream, 0, uv=0, smooth=False)

    if tiers <= 0:
        # lashing gear / spare hatch furniture instead of boxes
        for side in (-1, 1):
            add_box(f"LashBin_{idx}_{'S' if side > 0 else 'P'}",
                    (side * 5.4, top + COVER_T + 0.55, zc - hl + 1.6),
                    (2.2, 1.0, 1.6), mat_metal, 0.08, uv=3.0)
        return

    # 40 ft containers: 12.19 long, 2.44 wide, 2.59 high, on 6 athwartships rows
    base = top + COVER_T
    ci = 0
    for tier in range(tiers):
        rows = 6 if tier < tiers - 1 else 4
        for r in range(rows):
            x = (r - (rows - 1) * 0.5) * 2.52
            y = base + 0.10 + tier * 2.66 + 2.59 * 0.5
            mat = _box_mat(idx, tier, r)
            o = add_box(f"Container_{idx}_{ci}", (x, y, zc), (2.44, 2.59, 12.19), mat, 0.05, uv=3.0)
            ci += 1
            # corrugation ribs (one strip per side reads as corrugation at range)
            for side in (-1, 1):
                add_box(f"BoxRib_{idx}_{ci}_{side}", (x + side * 1.23, y, zc),
                        (0.06, 2.20, 11.6), mat_metal, 0, uv=0, smooth=False)


for i, (zc, hl, tiers) in enumerate(HATCHES):
    hatch(i, zc, hl, tiers)


# ---- deck cranes ------------------------------------------------------------
def deck_crane(name, zc, yaw, luff=42.0):
    d = sheer(zc)
    add_cyl(f"{name}_Pedestal", (0, d + 2.9, zc), 1.95, 5.8, mat_cream, verts=18, uv=5.0)
    add_cyl(f"{name}_Ring", (0, d + 5.9, zc), 2.10, 0.35, mat_metal, verts=18)
    hy = math.radians(yaw)
    # machinery house
    add_box(f"{name}_House", (math.sin(hy) * -1.6, d + 8.0, zc + math.cos(hy) * -1.6),
            (4.4, 4.2, 6.0), mat_cream, 0.14, rot=(0, hy, 0), uv=4.0)
    add_box(f"{name}_Cab", (math.sin(hy) * 2.6 + math.cos(hy) * 2.4, d + 8.4,
                            zc + math.cos(hy) * 2.6 - math.sin(hy) * 2.4),
            (2.0, 2.4, 2.2), mat_cream, 0.10, rot=(0, hy, 0), uv=3.0)
    add_box(f"{name}_CabGlass", (math.sin(hy) * 3.5 + math.cos(hy) * 2.4, d + 8.7,
                                 zc + math.cos(hy) * 3.5 - math.sin(hy) * 2.4),
            (0.14, 1.2, 1.7), mat_glass, 0.02, rot=(0, hy, 0), uv=0)
    # jib — tapered box boom, luffed up
    L = 20.0
    el = math.radians(luff)
    mx = math.sin(hy) * math.cos(el)
    mz = math.cos(hy) * math.cos(el)
    my = math.sin(el)
    cx, cy, cz = mx * L * 0.5, d + 9.8 + my * L * 0.5, zc + mz * L * 0.5
    add_box(f"{name}_Jib", (cx, cy, cz), (0.82, 1.05, L), mat_cream, 0.06,
            rot=(-el, hy, 0), uv=5.0)
    # boom flanges — a plain slab boom reads as a plank; the top/bottom chords
    # give it a box-girder section that catches light along its length
    for o in (-0.52, 0.52):
        add_box(f"{name}_JibChord_{o}", (cx - mx * 0 + math.sin(hy + math.pi / 2) * 0.0,
                                         cy + o, cz),
                (1.02, 0.16, L * 0.97), mat_cream, 0, rot=(-el, hy, 0), uv=0, smooth=False)
    add_box(f"{name}_JibHead", (mx * L, d + 9.8 + my * L, zc + mz * L),
            (0.9, 1.0, 1.0), mat_metal, 0.08, rot=(-el, hy, 0), uv=0)
    # hoist wire + block hanging under the head
    add_box(f"{name}_Wire", (mx * L, d + 9.8 + my * L - 3.4, zc + mz * L),
            (0.07, 6.6, 0.07), mat_metal, 0, uv=0, smooth=False)
    add_box(f"{name}_Hook", (mx * L, d + 9.8 + my * L - 7.0, zc + mz * L),
            (0.46, 0.75, 0.46), mat_metal, 0.05, uv=0)


deck_crane("CraneA", 33.5, 28.0, 40.0)
deck_crane("CraneB", 12.5, -34.0, 44.0)
deck_crane("CraneC", -8.5, 18.0, 38.0)


# --------------------------------------------------------------------------
# ACCOMMODATION BLOCK — five stepped tiers, bridge with full-beam wings
# --------------------------------------------------------------------------
TIERS = [
    ("DeckA", DH_AFT, DH_FWD, 8.60, DECK_Y - 0.10, A_DECK),
    ("DeckB", DH_AFT + 0.5, DH_FWD - 0.5, 8.45, A_DECK - 0.05, B_DECK),
    ("DeckC", DH_AFT + 1.0, DH_FWD - 1.0, 8.30, B_DECK - 0.05, C_DECK),
    ("DeckD", DH_AFT + 1.5, DH_FWD - 1.5, 8.15, C_DECK - 0.05, D_DECK),
]
for name, za, zf, hw, y0, y1 in TIERS:
    poly_prism(name, rounded_plan(za, zf, hw, 1.5), y0, y1, mat_cream,
               inset_top=0.05, bevel_w=0.10, uv=6.0)

# bridge deck — steps forward of the tiers below and carries the wings
BR_AFT, BR_FWD, BR_HW = -50.0, -33.2, 8.90
poly_prism("BridgeDeck", rounded_plan(BR_AFT, BR_FWD, BR_HW, 1.3), D_DECK - 0.05, BRIDGE_TOP,
           mat_cream, inset_top=0.10, bevel_w=0.10, uv=6.0)
poly_prism("MonkeyIsland", rounded_plan(-47.5, -35.5, 7.4, 1.2), BRIDGE_TOP - 0.05, MONKEY,
           mat_cream, inset_top=0.06, bevel_w=0.08, uv=5.0)

# bridge wings out to the ship's full beam
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    # The wing deck is the WHEELHOUSE FLOOR extended outboard (y = D_DECK), not a
    # shelf partway up the wheelhouse — the watchkeeper walks straight out of the
    # bridge door onto it to con the ship alongside.
    wing = [(side * BR_HW, -35.6), (side * 10.45, -36.3),
            (side * 10.45, -42.0), (side * BR_HW, -42.6)]
    poly_prism(f"BridgeWing_{tag}", wing, D_DECK - 0.35, D_DECK + 0.05, mat_cream,
               bevel_w=0.06, uv=5.0)
    # wing bulwark + rail
    add_box(f"WingBulwark_{tag}", (side * 10.42, D_DECK + 0.60, -39.1),
            (0.20, 1.15, 6.3), mat_cream, 0.03, uv=4.0)
    add_box(f"WingRailTop_{tag}", (side * 10.40, D_DECK + 1.24, -39.1),
            (0.10, 0.10, 6.3), mat_metal, 0, uv=0, smooth=False)
    add_box(f"WingFwd_{tag}", (side * 9.6, D_DECK + 0.60, -36.1),
            (1.9, 1.15, 0.20), mat_cream, 0.03, uv=0)
    add_box(f"WingAft_{tag}", (side * 9.6, D_DECK + 0.60, -42.3),
            (1.9, 1.15, 0.20), mat_cream, 0.03, uv=0)
    # wing console box + repeater, so the wing is not a bare shelf up close
    add_box(f"WingConsole_{tag}", (side * 9.95, D_DECK + 0.65, -38.4),
            (0.65, 1.20, 1.3), mat_metal, 0.06, uv=0)
    # wing support brackets underneath
    for k in range(3):
        add_box(f"WingStrut_{tag}_{k}", (side * 9.7, D_DECK - 0.9, -37.4 - k * 1.9),
                (1.9, 2.0, 0.16), mat_cream, 0, rot=(0, 0, math.radians(side * 26)),
                uv=0, smooth=False)

# ---- windows ----------------------------------------------------------------
# Accommodation cabin windows: a row of square lights per tier on the fwd face
# and both sides, with painted surrounds — far more legible at range than one
# continuous smoked band.
def cabin_windows(tag, y, za, zf, hw, count_side=6):
    for side in (-1, 1):
        s = "S" if side > 0 else "P"
        for k in range(count_side):
            z = za + 2.0 + (zf - za - 4.0) * k / max(count_side - 1, 1)
            add_box(f"Win_{tag}_{s}_{k}", (side * (hw + 0.03), y, z),
                    (0.14, 0.95, 1.15), mat_glass, 0.02, uv=0, smooth=False)
            add_box(f"WinTrim_{tag}_{s}_{k}", (side * (hw - 0.02), y, z),
                    (0.10, 1.25, 1.45), mat_white, 0, uv=0, smooth=False)
    for k in range(5):
        x = (k - 2) * 3.1
        add_box(f"Win_{tag}_F_{k}", (x, y, zf + 0.03), (1.15, 0.95, 0.14), mat_glass, 0.02,
                uv=0, smooth=False)
        add_box(f"WinTrim_{tag}_F_{k}", (x, y, zf - 0.02), (1.45, 1.25, 0.10), mat_white, 0,
                uv=0, smooth=False)


cabin_windows("A", DECK_Y + 1.9, DH_AFT, DH_FWD, 8.60)
cabin_windows("B", A_DECK + 1.6, DH_AFT + 0.5, DH_FWD - 0.5, 8.45)
cabin_windows("C", B_DECK + 1.6, DH_AFT + 1.0, DH_FWD - 1.0, 8.30)
cabin_windows("D", C_DECK + 1.6, DH_AFT + 1.5, DH_FWD - 1.5, 8.15)

# wheelhouse glazing: continuous raked band, front + both sides + aft doors
WHEEL_LO, WHEEL_HI = D_DECK + 1.35, BRIDGE_TOP - 0.55
WY = (WHEEL_LO + WHEEL_HI) * 0.5
WH = WHEEL_HI - WHEEL_LO
RAKE = math.radians(-6.0)
add_box("Wheel_GlassF", (0, WY, BR_FWD + 0.10 + (WY - D_DECK) * math.tan(RAKE)),
        (BR_HW * 2 - 2.6, WH, 0.26), mat_glass, 0.02, rot=(RAKE, 0, 0), uv=0)
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    add_box(f"Wheel_GlassSide_{tag}", (side * (BR_HW + 0.02), WY, -41.0),
            (0.26, WH, 9.5), mat_glass, 0.02, uv=0)
    add_box(f"Wheel_GlassCorner_{tag}", (side * (BR_HW - 0.65), WY, BR_FWD - 0.5),
            (2.4, WH, 0.26), mat_glass, 0.02, rot=(0, math.radians(side * 40), 0), uv=0)
for k in range(9):
    add_box(f"Wheel_Mullion_{k}", (-7.2 + k * 1.8, WY, BR_FWD + 0.18 + (WY - D_DECK) * math.tan(RAKE)),
            (0.16, WH + 0.10, 0.24), mat_white, 0, rot=(RAKE, 0, 0), uv=0, smooth=False)
add_box("Wheel_Eyebrow", (0, WHEEL_HI + 0.30, BR_FWD + 0.55), (BR_HW * 2 - 1.4, 0.26, 1.0),
        mat_cream, 0.04, uv=0)
for side in (-1, 1):
    add_box(f"Wheel_EyebrowSide_{'S' if side > 0 else 'P'}",
            (side * (BR_HW + 0.30), WHEEL_HI + 0.30, -41.0), (0.9, 0.24, 9.5), mat_cream, 0.04, uv=0)

# ---- deckhouse surface detail: doors, ladders, tier rails, deck edges --------
for i, (name, za, zf, hw, y0, y1) in enumerate(TIERS):
    for side in (-1, 1):
        tag = "S" if side > 0 else "P"
        # Cantilevered external walkway ringing each tier. The tiers only step
        # back ~0.15 m, so without this the rail floats in mid-air off the side of
        # the house with nothing under it — every deck on a real accommodation
        # block has a walkable ledge on brackets outboard of the bulkhead.
        add_box(f"TierWalk_{i}_{tag}", (side * (hw + 0.46), y1 + 0.05, (za + zf) * 0.5),
                (0.95, 0.16, zf - za), mat_cream, 0, uv=5.0)
        for k in range(5):
            add_box(f"TierBracket_{i}_{tag}_{k}",
                    (side * (hw + 0.42), y1 - 0.36, za + 1.5 + (zf - za - 3.0) * k / 4.0),
                    (0.85, 0.75, 0.14), mat_cream, 0,
                    rot=(0, 0, math.radians(side * 34)), uv=0, smooth=False)
        for k in range(6):
            z = za + (zf - za) * k / 5.0
            add_box(f"TierStanch_{i}_{tag}_{k}", (side * (hw + 0.86), y1 + 0.66, z),
                    (0.08, 1.05, 0.08), mat_metal, 0, uv=0, smooth=False)
        add_box(f"TierRail_{i}_{tag}", (side * (hw + 0.86), y1 + 1.18, (za + zf) * 0.5),
                (0.09, 0.09, zf - za), mat_metal, 0, uv=0, smooth=False)
        add_box(f"TierRailMid_{i}_{tag}", (side * (hw + 0.86), y1 + 0.70, (za + zf) * 0.5),
                (0.07, 0.07, zf - za), mat_metal, 0, uv=0, smooth=False)
        # watertight door on each side, aft
        add_box(f"HouseDoor_{i}_{tag}", (side * (hw + 0.02), y0 + 1.20, za + 2.6),
                (0.16, 2.05, 0.90), mat_metal, 0.02, uv=0, smooth=False)
        # external ladder between tiers, aft face
        add_box(f"HouseLadder_{i}_{tag}", (side * 5.2, (y0 + y1) * 0.5, za - 0.55),
                (0.75, y1 - y0, 0.14), mat_metal, 0, rot=(math.radians(11), 0, 0),
                uv=0, smooth=False)
    # aft-face vent louvres
    add_box(f"HouseVent_{i}", (0, (y0 + y1) * 0.5 + 0.4, za - 0.10),
            (4.2, 1.1, 0.20), mat_metal, 0.03, uv=0, smooth=False)

# bridge-deck perimeter rail (above the wheelhouse, on the monkey island)
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    for k in range(8):
        z = -47.0 + k * 1.6
        add_box(f"MonkStanch_{tag}_{k}", (side * 7.3, MONKEY + 0.55, z),
                (0.08, 1.0, 0.08), mat_metal, 0, uv=0, smooth=False)
    add_box(f"MonkRail_{tag}", (side * 7.3, MONKEY + 1.05, -41.5), (0.09, 0.09, 12.0),
            mat_metal, 0, uv=0, smooth=False)

# accommodation ladder (gangway) stowed against the side, plus its davit
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    add_box(f"Gangway_{tag}", (side * 10.58, DECK_Y - 1.1, -28.0), (0.55, 0.30, 10.0),
            mat_metal, 0.04, rot=(math.radians(7), 0, 0), uv=0)
    add_box(f"GangwayRail_{tag}", (side * 10.78, DECK_Y - 0.25, -28.0), (0.10, 0.10, 10.0),
            mat_metal, 0, rot=(math.radians(7), 0, 0), uv=0, smooth=False)
    add_box(f"GangwayDavit_{tag}", (side * 9.2, DECK_Y + 2.2, -23.0), (0.26, 5.0, 0.26),
            mat_cream, 0, uv=0)


# --------------------------------------------------------------------------
# FUNNEL — raked casing abaft the wheelhouse, company colours, real stack cap
# --------------------------------------------------------------------------
FUN_AFT, FUN_FWD = -56.8, -47.6
FUN_HW = 3.95
FUN_BASE, FUN_TOP = D_DECK - 0.4, 33.4
poly_prism("FunnelCasing", rounded_plan(FUN_AFT, FUN_FWD, FUN_HW, 1.0), FUN_BASE, FUN_TOP - 3.6,
           mat_funnel, inset_top=0.55, bevel_w=0.12, uv=5.0)
poly_prism("FunnelBand", rounded_plan(FUN_AFT + 0.60, FUN_FWD - 0.60, FUN_HW - 0.58, 0.9),
           FUN_TOP - 3.65, FUN_TOP - 1.55, mat_black, inset_top=0.20, bevel_w=0.10, uv=4.0)
poly_prism("FunnelCap", rounded_plan(FUN_AFT + 0.55, FUN_FWD - 0.55, FUN_HW - 0.32, 0.9),
           FUN_TOP - 1.60, FUN_TOP, mat_black, inset_top=-0.22, bevel_w=0.10, uv=4.0)
# uptakes emerging through the cap
for side in (-1, 1):
    add_cyl(f"Uptake_{'S' if side > 0 else 'P'}",
            (side * 1.35, FUN_TOP + 0.55, (FUN_AFT + FUN_FWD) * 0.5), 0.62, 2.4, mat_metal, verts=14)
add_cyl("UptakeAux", (0, FUN_TOP + 0.20, FUN_AFT + 1.5), 0.34, 2.0, mat_metal, verts=10)
# funnel-side company mark + soot streak plate, plus access ladder
add_box("FunnelMark", (0, FUN_TOP - 6.6, FUN_FWD - 0.02), (3.4, 3.0, 0.16), mat_white, 0.02, uv=0)
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    add_box(f"FunnelLadder_{tag}", (side * (FUN_HW - 0.15), FUN_TOP - 6.0, FUN_AFT + 1.2),
            (0.14, 11.0, 0.62), mat_metal, 0, uv=0, smooth=False)
    for k in range(5):
        add_box(f"FunnelStrap_{tag}_{k}", (side * (FUN_HW + 0.04), FUN_BASE + 1.6 + k * 2.1,
                                           (FUN_AFT + FUN_FWD) * 0.5),
                (0.10, 0.18, FUN_FWD - FUN_AFT - 1.2), mat_metal, 0, uv=0, smooth=False)
# engine-room skylight / casing at the funnel base
poly_prism("EngineCasing", rounded_plan(FUN_AFT - 1.6, FUN_FWD + 1.4, 5.6, 1.0),
           C_DECK - 0.05, D_DECK - 0.35, mat_cream, inset_top=0.10, bevel_w=0.10, uv=5.0)
add_empty("SmokeStack", (0, FUN_TOP + 1.8, (FUN_AFT + FUN_FWD) * 0.5))


# --------------------------------------------------------------------------
# RADAR / SIGNAL MAST on the monkey island
# --------------------------------------------------------------------------
MAST_Z = -41.5
add_cyl("Mast", (0, MONKEY + 5.4, MAST_Z), 0.40, 10.8, mat_cream, verts=12, radius2=0.26)
for side in (-1, 1):
    add_box(f"MastLeg_{'S' if side > 0 else 'P'}", (side * 1.7, MONKEY + 2.4, MAST_Z + 0.6),
            (0.20, 4.9, 0.20), mat_cream, 0, rot=(0, 0, math.radians(side * 14)), uv=0)
add_box("MastPlatform", (0, MONKEY + 4.1, MAST_Z), (3.4, 0.16, 2.6), mat_cream, 0.04, uv=4.0)
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    add_box(f"MastPlatRail_{tag}", (side * 1.65, MONKEY + 4.65, MAST_Z), (0.08, 0.08, 2.6),
            mat_metal, 0, uv=0, smooth=False)
# S-band + X-band navigation radar scanners (open-array bars, one slotted)
add_box("RadarPedS", (0, MONKEY + 4.55, MAST_Z), (0.85, 0.85, 0.85), mat_white, 0.06, uv=0)
add_box("RadarArrayS", (0, MONKEY + 5.15, MAST_Z), (3.9, 0.30, 0.42), mat_white, 0.05,
        rot=(0, math.radians(24), 0), uv=0)
add_box("RadarPedX", (0, MONKEY + 8.9, MAST_Z), (0.75, 0.75, 0.75), mat_white, 0.06, uv=0)
add_box("RadarArrayX", (0, MONKEY + 9.4, MAST_Z), (2.9, 0.24, 0.34), mat_white, 0.05,
        rot=(0, math.radians(-38), 0), uv=0)
# signal yard + navigation lights + satcom domes
add_box("SignalYard", (0, MONKEY + 7.3, MAST_Z), (5.6, 0.16, 0.26), mat_cream, 0.03, uv=0)
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    col = hexc("1E7A3A") if side > 0 else hexc("9A2222")
    m = flat_mat(f"MV_NavLight_{tag}", col, 0.30, 0.05, emission=col, strength=1.6)
    add_box(f"NavLight_{tag}", (side * 2.8, MONKEY + 7.6, MAST_Z), (0.34, 0.52, 0.34), m, 0.04, uv=0)
    add_box(f"Whip_{tag}", (side * 2.3, MONKEY + 9.0, MAST_Z), (0.07, 4.2, 0.07), mat_metal, 0,
            uv=0, smooth=False)
add_sphere("SatcomA", (2.4, MONKEY + 2.3, MAST_Z + 3.0), 0.95, mat_white, segs=14, rings=8)
add_sphere("SatcomB", (-2.4, MONKEY + 2.0, MAST_Z + 3.0), 0.72, mat_white, segs=12, rings=7)
add_box("MastTruck", (0, MONKEY + 11.0, MAST_Z), (0.55, 0.45, 0.55), mat_white, 0.04, uv=0)
add_cyl("MastWhip", (0, MONKEY + 12.8, MAST_Z), 0.06, 3.2, mat_metal, verts=6, bevel_w=0)


# --------------------------------------------------------------------------
# LIFESAVING + AFT MOORING DECK
# --------------------------------------------------------------------------
# freefall lifeboat on an inclined stern skid — the single most recognisable
# modern merchant fitting
add_box("LifeboatSkid", (0, DECK_Y + 3.1, -63.2), (4.6, 0.55, 9.0), mat_metal, 0.08,
        rot=(math.radians(-26), 0, 0), uv=3.0)
for side in (-1, 1):
    add_box(f"SkidLeg_{'S' if side > 0 else 'P'}", (side * 1.9, DECK_Y + 2.0, -60.4),
            (0.30, 4.0, 0.30), mat_metal, 0, uv=0)
bpy.ops.mesh.primitive_uv_sphere_add(radius=2.0, location=(0, DECK_Y + 4.4, -63.6),
                                     segments=18, ring_count=10)
lb = bpy.context.active_object
lb.name = "Lifeboat"
lb.scale = (0.85, 0.80, 2.35)
lb.rotation_euler = (math.radians(-26), 0, 0)
bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
lb.data.materials.append(mat_orange)
shade_smooth(lb, 45)
add_box("LifeboatCanopy", (0, DECK_Y + 5.6, -63.9), (2.2, 0.9, 4.4), mat_orange, 0.30,
        rot=(math.radians(-26), 0, 0), uv=0)

# rescue boat + davit on the starboard side of the boat deck
add_box("RescueBoat", (9.0, C_DECK + 1.2, -52.0), (2.1, 1.4, 6.0), mat_orange, 0.30, uv=3.0)
add_box("RescueDavit", (9.9, C_DECK + 3.0, -52.0), (0.26, 4.0, 0.26), mat_cream, 0, uv=0)
add_box("RescueDavitArm", (9.4, C_DECK + 4.8, -52.0), (2.4, 0.24, 0.24), mat_cream, 0, uv=0)
for side, z in ((-1, -50.0), (-1, -55.0), (1, -47.0)):
    tag = f"{'S' if side > 0 else 'P'}{abs(int(z))}"
    add_cyl(f"RaftCanister_{tag}", (side * 8.9, C_DECK + 0.9, z), 0.62, 1.9, mat_white,
            axis="Z", verts=12)
    add_box(f"RaftCradle_{tag}", (side * 8.9, C_DECK + 0.25, z), (1.5, 0.5, 2.1), mat_metal, 0.06, uv=0)

# aft mooring deck furniture
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    add_box(f"MooringWinch_{tag}", (side * 4.6, sheer(-68.0) + 0.95, -68.0), (3.2, 1.9, 2.6),
            mat_metal, 0.10, uv=3.0)
    add_cyl(f"WinchDrum_{tag}", (side * 6.6, sheer(-68.0) + 1.05, -68.0), 0.95, 1.5, mat_steel,
            axis="X", verts=14)
    add_box(f"SternVent_{tag}", (side * 7.2, sheer(-62.0) + 1.2, -62.0), (1.0, 2.4, 1.0),
            mat_cream, 0.10, uv=3.0)
add_box("SternRoller", (0, sheer(-73.5) + 0.6, -73.5), (3.2, 1.0, 1.0), mat_steel, 0.20, uv=0)
add_cyl("Ensign", (0, sheer(-74.0) + 3.2, -74.0), 0.09, 6.0, mat_white, verts=8, bevel_w=0)

# bollards / fairleads down both sides
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    for i, z in enumerate([70.0, 62.0, 34.0, -8.0, -30.0, -68.0, -73.5]):
        base = fc_y(z) if z > FC_AFT else sheer(z)
        x = side * (deck_hw(z) - 1.25)
        add_box(f"BollardBase_{tag}_{i}", (x, base + 0.20, z), (1.9, 0.30, 1.0), mat_metal, 0.04,
                uv=0, smooth=False)
        for o in (-0.55, 0.55):
            add_cyl(f"Bollard_{tag}_{i}_{o}", (x + o, base + 0.75, z), 0.24, 0.95, mat_metal,
                    verts=8, bevel_w=0.03)
        add_box(f"Fairlead_{tag}_{i}", (side * (deck_hw(z) - 0.20), base + 0.55, z + 2.2),
                (0.75, 0.85, 1.5), mat_metal, 0.10, uv=0)

# mushroom vents + goosenecks along the cargo deck edges
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    for i, z in enumerate([47.0, 38.0, 28.0, 17.0, 7.0, -3.0, -13.0, -24.0]):
        x = side * (deck_hw(z) - 1.9)
        add_cyl(f"VentTrunk_{tag}_{i}", (x, sheer(z) + 0.85, z), 0.42, 1.7, mat_cream, verts=10)
        add_cyl(f"VentHead_{tag}_{i}", (x, sheer(z) + 1.85, z), 0.62, 0.55, mat_cream, verts=12)
    # deck pipe run (bunker / ballast lines)
    add_box(f"DeckPipe_{tag}", (side * (deck_hw(0.0) - 2.9), sheer(0.0) + 0.32, 5.0),
            (0.30, 0.30, 86.0), mat_metal, 0.06, uv=0)
    for i in range(12):
        z = -34.0 + i * 7.4
        add_box(f"PipeSaddle_{tag}_{i}", (side * (deck_hw(z) - 2.9), sheer(z) + 0.12, z),
                (0.55, 0.35, 0.30), mat_metal, 0, uv=0, smooth=False)

# main-deck railing above the bulwark, forward cargo area only (aft is bulwarked)
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    for k in range(16):
        z = -32.0 + k * 5.4
        if z > 51.0:
            break
        add_box(f"DeckStanch_{tag}_{k}", (side * (deck_hw(z) - 0.30), sheer(z) + 1.55, z),
                (0.08, 0.95, 0.08), mat_metal, 0, uv=0, smooth=False)
        if k:
            zp = z - 5.4
            zc = (z + zp) * 0.5
            yaw = math.atan2((deck_hw(z) - deck_hw(zp)) * side, 5.4)
            add_box(f"DeckRail_{tag}_{k}", (side * (deck_hw(zc) - 0.30), sheer(zc) + 2.00, zc),
                    (0.09, 0.09, 5.5), mat_metal, 0, rot=(0, -yaw, 0), uv=0, smooth=False)

# draught marks + a name/port plate at the bow and stern, in white
for side in (-1, 1):
    tag = "S" if side > 0 else "P"
    for k in range(7):
        add_box(f"DraughtMark_{tag}_{k}", (side * (deck_hw(64.0) - 0.02), 0.6 + k * 0.62, 64.0),
                (0.10, 0.22, 0.85), mat_white, 0, uv=0, smooth=False)
        add_box(f"DraughtMarkA_{tag}_{k}", (side * (deck_hw(-64.0) - 0.02), 0.6 + k * 0.62, -64.0),
                (0.10, 0.22, 0.85), mat_white, 0, uv=0, smooth=False)
    add_box(f"NamePlate_{tag}", (side * (deck_hw(58.0) - 0.02), sheer(58.0) - 1.9, 58.0),
            (0.10, 0.85, 7.0), mat_white, 0, uv=0, smooth=False)
add_box("SternName", (0, sheer(-74.0) - 2.0, -74.9), (8.5, 0.85, 0.10), mat_white, 0, uv=0, smooth=False)


# --------------------------------------------------------------------------
# merge by material — ~600 primitives would otherwise be ~600 draw calls
# --------------------------------------------------------------------------
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
        objs[0].name = f"MV_{mat_name}"
        continue
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    try:
        bpy.ops.object.join()
        bpy.context.view_layer.objects.active.name = f"MV_{mat_name}"
    except Exception:
        pass
bpy.ops.object.select_all(action="DESELECT")

bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 0, 0))
root = bpy.context.active_object
root.name = "MV_KestrelBay"
for obj in list(scene.objects):
    if obj != root and obj.type in {"MESH", "EMPTY"} and obj.parent is None:
        obj.parent = root

# See the module docstring: this +90 deg X rotation on the root is what makes the
# exported GLB land bow=+Z / up=+Y in glTF space, matching escort_hull.glb so the
# runtime loader needs no reconciling rotation. Do not remove it.
root.rotation_euler = (math.radians(90), 0, 0)

tris = 0
for o in scene.objects:
    if o.type == "MESH" and o.data:
        o.data.calc_loop_triangles()
        tris += len(o.data.loop_triangles)
mesh_objs = [o for o in scene.objects if o.type == "MESH"]

OUT.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=str(OUT), export_format="GLB", use_selection=False,
    export_apply=True, export_yup=True, export_materials="EXPORT",
    export_image_format="AUTO", export_texcoords=True, export_normals=True,
)
OUT_MIRROR.parent.mkdir(parents=True, exist_ok=True)
shutil.copyfile(OUT, OUT_MIRROR)
size_mb = OUT.stat().st_size / (1024 * 1024)
print(f"EXPORTED {OUT} (+ src mirror) tris={tris} mesh_objs={len(mesh_objs)} "
      f"objs={len(scene.objects)} size={size_mb:.2f}MB LOA={LOA} BEAM={BEAM} "
      f"deck={DECK_Y} bridge={D_DECK}-{BRIDGE_TOP}m funnel_top={FUN_TOP}m")
