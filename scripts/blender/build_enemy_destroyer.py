"""
Build a high-detail enemy destroyer and export GLB for MERIDIAN.
Orientation: bow = +Y in Blender XY plan view → we export with bow = +Z for the game.
Run:
  /Applications/Blender.app/Contents/MacOS/Blender --background --python scripts/blender/build_enemy_destroyer.py
"""
import bpy
import bmesh
import math
from mathutils import Vector, Matrix
from pathlib import Path

OUT = Path("/Users/tje/games/warship/src/assets/models/enemy_destroyer.glb")

# ---- reset ----
bpy.ops.wm.read_factory_settings(use_empty=True)
# factory empty still may leave camera/light depending on version
for obj in list(bpy.data.objects):
    bpy.data.objects.remove(obj, do_unlink=True)

scene = bpy.context.scene


def new_mat(name, color, roughness=0.55, metallic=0.15):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = nt.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    if "Metallic" in bsdf.inputs:
        bsdf.inputs["Metallic"].default_value = metallic
    # slight specular variation if present
    if "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = 0.35
    return mat


def link(obj):
    scene.collection.objects.link(obj)
    return obj


def mesh_from_bmesh(name, bm):
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    return link(obj)


def bevel(obj, width=0.08, segments=2):
    mod = obj.modifiers.new("Bevel", "BEVEL")
    mod.width = width
    mod.segments = segments
    mod.limit_method = "ANGLE"
    mod.angle_limit = math.radians(30)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=mod.name)


def shade_smooth(obj, angle=40):
    mesh = obj.data
    for p in mesh.polygons:
        p.use_smooth = True
    mod = obj.modifiers.new("Smooth", "EDGE_SPLIT")
    # prefer autosmooth via custom normals if available
    try:
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.shade_smooth(use_auto_smooth=True, angle=math.radians(angle))
    except Exception:
        pass


# Materials
mat_hull = new_mat("HullGrey", (0.42, 0.44, 0.47), roughness=0.72, metallic=0.22)
mat_super = new_mat("SuperGrey", (0.50, 0.52, 0.55), roughness=0.65, metallic=0.18)
mat_boot = new_mat("BootTop", (0.05, 0.055, 0.06), roughness=0.85, metallic=0.05)
mat_deck = new_mat("Deck", (0.28, 0.30, 0.32), roughness=0.9, metallic=0.1)
mat_glass = new_mat("BridgeGlass", (0.05, 0.08, 0.1), roughness=0.15, metallic=0.55)
mat_metal = new_mat("DarkMetal", (0.12, 0.12, 0.13), roughness=0.4, metallic=0.7)
mat_radome = new_mat("Radome", (0.85, 0.86, 0.88), roughness=0.45, metallic=0.05)
mat_accent = new_mat("IFF", (0.55, 0.12, 0.12), roughness=0.55, metallic=0.1)

# Scale: ~140m LOA, beam ~16m, draft/freeboard ~8m deck
LOA = 140.0
BEAM = 16.0
DECK_Y = 7.2
HALF = LOA * 0.5

# ---- Hull via lofted cross-sections (tapered bow/stern, not a box) ----
bm = bmesh.new()
# Cross-section profiles along Z (bow +Z): list of (z, half_beam, keel_y, deck_y, flare)
stations = [
    # z, half_beam, keel, deck, bow_pointyness (0=full beam at water, 1=knife)
    (-HALF + 2.0, 0.8, -2.2, DECK_Y * 0.55, 0.0),   # stern
    (-HALF + 18, 6.2, -3.5, DECK_Y, 0.0),
    (-HALF + 40, 7.8, -4.0, DECK_Y, 0.0),
    (-20, 8.0, -4.2, DECK_Y, 0.0),
    (20, 7.9, -4.0, DECK_Y, 0.05),
    (HALF - 35, 6.5, -3.2, DECK_Y + 0.4, 0.15),
    (HALF - 18, 3.8, -1.8, DECK_Y + 0.9, 0.35),
    (HALF - 6, 1.4, -0.4, DECK_Y + 1.4, 0.7),
    (HALF - 0.5, 0.15, 0.6, DECK_Y + 1.8, 1.0),  # stem
]

rings = []
for z, hb, keel, deck, tip in stations:
    ring = []
    # 12 points around half-hull mirrored later — build full ellipse-ish
    segs = 16
    for i in range(segs):
        t = i / segs
        ang = t * math.pi  # 0..pi bottom then we'll mirror? Better full loop
    # full loop 0..2pi
    segs = 20
    verts = []
    for i in range(segs):
        a = (i / segs) * math.pi * 2.0
        # waterline ellipse with V-ish bottom
        x = math.cos(a) * hb
        # bottom more pointed
        y_shape = math.sin(a)
        if y_shape < 0:
            y = keel + (0 - keel) * (1.0 + y_shape) ** 1.35
        else:
            y = 0 + (deck - 0) * (y_shape ** 0.85)
        # pinch toward bow tip
        x *= (1.0 - tip * abs(math.cos(a)) * 0.15)
        verts.append(bm.verts.new((x, y, z)))
    rings.append(verts)

# bridge rings with faces
for ri in range(len(rings) - 1):
    a = rings[ri]
    b = rings[ri + 1]
    n = len(a)
    for i in range(n):
        j = (i + 1) % n
        try:
            bm.faces.new((a[i], a[j], b[j], b[i]))
        except ValueError:
            pass

bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
hull = mesh_from_bmesh("Hull", bm)
hull.data.materials.append(mat_hull)
bevel(hull, 0.06, 2)
shade_smooth(hull)

# ---- Deck plate (slightly inset) ----
bm = bmesh.new()
deck_verts_outer = []
for z, hb, keel, deck, tip in stations[1:-1]:
    deck_verts_outer.append((hb * 0.92, deck + 0.05, z))
    deck_verts_outer.append((-hb * 0.92, deck + 0.05, z))
# simpler: box-like deck following mid stations
bm.free()
bpy.ops.mesh.primitive_cube_add(size=1)
deck = bpy.context.active_object
deck.name = "Deck"
deck.scale = (BEAM * 0.78, 0.18, LOA * 0.72)
deck.location = (0, DECK_Y + 0.05, -4)
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
deck.data.materials.append(mat_deck)
bevel(deck, 0.04, 2)

# ---- Boot topping stripe ----
bpy.ops.mesh.primitive_cube_add(size=1)
boot = bpy.context.active_object
boot.name = "BootTop"
boot.scale = (BEAM * 0.52, 0.55, LOA * 0.88)
boot.location = (0, 0.15, -2)
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
boot.data.materials.append(mat_boot)

# ---- Superstructure (angled, multi-tier) ----
def add_box(name, loc, scale, mat, bevel_w=0.05):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    bevel(obj, bevel_w, 2)
    shade_smooth(obj)
    return obj

# main deckhouse amidships-aft
house = add_box("Deckhouse", (0, DECK_Y + 3.2, -8), (BEAM * 0.42, 3.0, 22), mat_super, 0.08)
# taper via lattice-ish: scale top by editing — use simple second tier
tier2 = add_box("BridgeTier", (0, DECK_Y + 6.6, -2), (BEAM * 0.32, 2.2, 12), mat_super, 0.07)
# bridge wing / bridge face
bridge = add_box("Bridge", (0, DECK_Y + 9.2, 4), (BEAM * 0.28, 2.0, 7), mat_super, 0.06)
# angled bridge face — rotate slightly
bridge.rotation_euler[0] = math.radians(-8)
# glass band
glass = add_box("BridgeGlass", (0, DECK_Y + 9.4, 7.55), (BEAM * 0.24, 0.9, 0.12), mat_glass, 0.02)

# ---- Mast / sensors ----
bpy.ops.mesh.primitive_cone_add(radius1=0.55, radius2=0.18, depth=11, location=(0, DECK_Y + 14.5, 0))
mast = bpy.context.active_object
mast.name = "Mast"
mast.data.materials.append(mat_metal)
shade_smooth(mast)

bpy.ops.mesh.primitive_uv_sphere_add(radius=1.1, location=(0, DECK_Y + 20.2, 0), segments=24, ring_count=16)
radome = bpy.context.active_object
radome.name = "Radome"
radome.data.materials.append(mat_radome)
shade_smooth(radome)

# yardarms
for yoff, zoff in [(18.5, 0.0), (16.8, 0.0)]:
    bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=6.5, location=(0, DECK_Y + yoff - DECK_Y + DECK_Y, zoff))
    yard = bpy.context.active_object
    yard.rotation_euler[1] = math.radians(90)
    yard.data.materials.append(mat_metal)

# ---- Gun turret forward ----
bpy.ops.mesh.primitive_cylinder_add(radius=2.4, depth=1.4, location=(0, DECK_Y + 1.0, 42), vertices=12)
turret = bpy.context.active_object
turret.name = "GunHouse"
turret.data.materials.append(mat_super)
bevel(turret, 0.05, 2)

bpy.ops.mesh.primitive_cylinder_add(radius=0.22, depth=7.5, location=(0, DECK_Y + 1.6, 46.5), vertices=12)
barrel = bpy.context.active_object
barrel.name = "GunBarrel"
barrel.rotation_euler[0] = math.radians(90)
barrel.data.materials.append(mat_metal)

# ---- VLS farm hint (forward deck rectangles) ----
for i, z in enumerate([28, 24, 20]):
    vls = add_box(f"VLS_{i}", (0, DECK_Y + 0.35, z), (4.5, 0.45, 3.2), mat_metal, 0.03)

# ---- CIWS dome aft ----
bpy.ops.mesh.primitive_uv_sphere_add(radius=1.3, location=(0, DECK_Y + 4.2, -28), segments=20, ring_count=12)
ciws = bpy.context.active_object
ciws.name = "CIWS"
ciws.scale[2] = 0.7
bpy.ops.object.transform_apply(scale=True)
ciws.data.materials.append(mat_radome)

# ---- Funnel ----
funnel = add_box("Funnel", (0, DECK_Y + 8.5, -18), (3.2, 4.5, 4.0), mat_super, 0.06)
cap = add_box("FunnelCap", (0, DECK_Y + 11.0, -18), (3.5, 0.35, 4.3), mat_metal, 0.02)
# IFF stripe
stripe = add_box("IFFStripe", (BEAM * 0.41, DECK_Y + 3.2, -8), (0.08, 1.2, 8), mat_accent, 0.01)

# ---- Parent under Empty ----
bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 0, 0))
root = bpy.context.active_object
root.name = "EnemyDestroyer"
# Game expects bow = +Z, keel down -Y in three.js (Y-up). Blender is Z-up with our hull along +Z already, Y up — matches Three.js after glTF (Y-up). Good.

for obj in list(scene.objects):
    if obj != root and obj.type in {"MESH", "EMPTY"}:
        if obj.parent is None and obj != root:
            obj.parent = root

# Count tris
tris = 0
for obj in scene.objects:
    if obj.type == "MESH" and obj.data:
        obj.data.calc_loop_triangles()
        tris += len(obj.data.loop_triangles)

OUT.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=str(OUT),
    export_format="GLB",
    use_selection=False,
    export_apply=True,
    export_yup=True,
)

print(f"EXPORTED {OUT} tris≈{tris}")
