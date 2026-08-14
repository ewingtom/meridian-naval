"""
Build a high-detail attack submarine GLB for MERIDIAN.
Bow = +Z in export. Run:
  /Applications/Blender.app/Contents/MacOS/Blender --background --python scripts/blender/build_submarine.py
"""
import bpy
import bmesh
import math
import sys
from mathutils import Vector
from pathlib import Path

_SCRIPT_DIR = str(Path(__file__).resolve().parent) if "__file__" in globals() \
    else "/Users/tje/games/warship/scripts/blender"
if _SCRIPT_DIR not in sys.path:
    sys.path.insert(0, _SCRIPT_DIR)
import warship_textures as wtex  # noqa: E402

OUT_PUBLIC = Path("/Users/tje/games/warship/public/assets/models/enemy_submarine.glb")
OUT_SRC = Path("/Users/tje/games/warship/src/assets/models/enemy_submarine.glb")
for out in (OUT_PUBLIC, OUT_SRC):
    out.parent.mkdir(parents=True, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
for obj in list(bpy.data.objects):
    bpy.data.objects.remove(obj, do_unlink=True)

scene = bpy.context.scene


def new_mat(name, color, roughness=0.55, metallic=0.2):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    if "Metallic" in bsdf.inputs:
        bsdf.inputs["Metallic"].default_value = metallic
    return mat


def new_hull_mat(name, base_color, panel_dark=None, roughness=0.62, metallic=0.35):
    """Hull paint with subtle circumferential + longitudinal panel lines."""
    if panel_dark is None:
        panel_dark = tuple(c * 0.72 for c in base_color)
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nt = mat.node_tree
    nodes = nt.nodes
    links = nt.links
    bsdf = nodes.get("Principled BSDF")

    coord = nodes.new("ShaderNodeTexCoord")
    mapping = nodes.new("ShaderNodeMapping")

    wave_z = nodes.new("ShaderNodeTexWave")
    wave_z.wave_type = "BANDS"
    wave_z.bands_direction = "Z"
    wave_z.inputs["Scale"].default_value = 16.0
    wave_z.inputs["Detail"].default_value = 0.0

    wave_x = nodes.new("ShaderNodeTexWave")
    wave_x.wave_type = "BANDS"
    wave_x.bands_direction = "X"
    wave_x.inputs["Scale"].default_value = 4.0
    wave_x.inputs["Detail"].default_value = 1.5
    wave_x.inputs["Detail Scale"].default_value = 1.2

    combine = nodes.new("ShaderNodeMath")
    combine.operation = "MAXIMUM"

    ramp = nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.47
    ramp.color_ramp.elements[1].position = 0.53

    mix = nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.inputs["A"].default_value = (*base_color, 1.0)
    mix.inputs["B"].default_value = (*panel_dark, 1.0)
    mix.inputs["Factor"].default_value = 0.28

    links.new(coord.outputs["Object"], mapping.inputs["Vector"])
    links.new(mapping.outputs["Vector"], wave_z.inputs["Vector"])
    links.new(mapping.outputs["Vector"], wave_x.inputs["Vector"])
    links.new(wave_z.outputs["Fac"], combine.inputs[0])
    links.new(wave_x.outputs["Fac"], combine.inputs[1])
    links.new(combine.outputs["Value"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], mix.inputs["Factor"])
    links.new(mix.outputs["Result"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = roughness
    if "Metallic" in bsdf.inputs:
        bsdf.inputs["Metallic"].default_value = metallic
    return mat


def link(obj):
    scene.collection.objects.link(obj)
    return obj


def apply_bevel(obj, width=0.05, segments=2):
    mod = obj.modifiers.new("Bevel", "BEVEL")
    mod.width = width
    mod.segments = segments
    mod.limit_method = "ANGLE"
    mod.angle_limit = math.radians(28)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=mod.name)


def shade(obj, angle=35):
    mesh = obj.data
    for p in mesh.polygons:
        p.use_smooth = True
    try:
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.shade_smooth(use_auto_smooth=True, angle=math.radians(angle))
    except TypeError:
        pass


def uv_cube(obj, size=5.5):
    """World-scale box projection so the tiling anechoic/metal maps hold a constant
    physical tile size across the whole boat (the loft has no UVs of its own)."""
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


def mesh_from_bmesh(name, bm, mat=None):
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    obj = link(bpy.data.objects.new(name, mesh))
    if mat:
        obj.data.materials.append(mat)
    return obj


def add_box(name, loc, scale, mat, bevel=0.04):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(scale=True)
    obj.data.materials.append(mat)
    if bevel:
        apply_bevel(obj, bevel, 2)
    shade(obj)
    return obj


def add_cylinder(name, loc, radius, depth, mat, vertices=16, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(
        radius=radius, depth=depth, vertices=vertices, location=loc, rotation=rotation
    )
    obj = bpy.context.active_object
    obj.name = name
    obj.data.materials.append(mat)
    shade(obj)
    return obj


def hull_radius_at(z, stations):
    """Approximate hull Y radius at longitudinal station for sail seating."""
    zs = [s[0] for s in stations]
    rs = [s[2] for s in stations]
    if z <= zs[0]:
        return rs[0]
    if z >= zs[-1]:
        return rs[-1]
    for i in range(len(zs) - 1):
        if zs[i] <= z <= zs[i + 1]:
            t = (z - zs[i]) / (zs[i + 1] - zs[i])
            return rs[i] + (rs[i + 1] - rs[i]) * t
    return rs[len(rs) // 2]


def build_hull_loft(stations, segs, mat):
    bm = bmesh.new()
    rings = []
    for z, rx, ry in stations:
        ring = []
        for i in range(segs):
            a = (i / segs) * math.pi * 2.0
            x = math.cos(a) * rx
            y = math.sin(a) * ry
            if y < 0:
                y *= 0.91
            ring.append(bm.verts.new((x, y, z)))
        rings.append(ring)
    bm.verts.ensure_lookup_table()

    for ri in range(len(rings) - 1):
        a, b = rings[ri], rings[ri + 1]
        for i in range(segs):
            j = (i + 1) % segs
            bm.faces.new((a[i], a[j], b[j], b[i]))

    bm.faces.new(list(reversed(rings[0])))
    bm.faces.new(rings[-1])

    hull = mesh_from_bmesh("SubHull", bm, mat)
    apply_bevel(hull, 0.055, 3)
    shade(hull, 32)
    return hull


def build_sail_loft(stations, mat):
    """Loft a tapered sail with rounded-rect cross sections fairing into the hull."""
    bm = bmesh.new()
    rings = []
    for z, half_x, y_base, y_top in stations:
        ring = []
        corners = [
            (-half_x, y_base),
            (-half_x, y_top),
            (half_x, y_top),
            (half_x, y_base),
        ]
        for cx, cy in corners:
            ring.append(bm.verts.new((cx, cy, z)))
        # soften leading edge (top-front) with a midpoint vertex
        mid_le = bm.verts.new((0.0, y_top + (y_top - y_base) * 0.08, z))
        ring.insert(2, mid_le)
        rings.append(ring)
    bm.verts.ensure_lookup_table()

    segs = len(rings[0])
    for ri in range(len(rings) - 1):
        a, b = rings[ri], rings[ri + 1]
        n = min(len(a), len(b))
        for i in range(n):
            j = (i + 1) % n
            bm.faces.new((a[i], a[j], b[j], b[i]))

    sail = mesh_from_bmesh("Sail", bm, mat)
    apply_bevel(sail, 0.07, 2)
    shade(sail, 30)
    return sail


# Materials. The old hull used a procedural node graph (wave textures) that the
# glTF exporter silently drops -> the sub shipped with zero maps and read as a
# featureless dark blob. Baked anechoic-tile + metal maps fix that (and survive
# export). See warship_textures.py.
mat_hull = new_mat("SubHull", (1.0, 1.0, 1.0), roughness=0.9, metallic=0.0)
mat_sail = new_mat("SubSail", (1.0, 1.0, 1.0), roughness=0.9, metallic=0.0)
mat_dark = new_mat("SubDark", (0.05, 0.055, 0.06), roughness=0.75, metallic=0.15)
mat_metal = new_mat("SubMetal", (1.0, 1.0, 1.0), roughness=0.4, metallic=0.75)
mat_rubber = new_mat("SubRubber", (0.04, 0.04, 0.045), roughness=0.9, metallic=0.05)

_anech = wtex.build_anechoic_set(size=512, seed=81, base_hex="212429", tiles=11,
                                 name="SUB_ANECHOIC")
_submetal = wtex.build_metal_set(size=256, seed=91, base_hex="2A2D31", name="SUB_METAL")
wtex.assign_pbr(mat_hull, _anech, metallic=None)   # metalness from ORM (bare patches)
wtex.assign_pbr(mat_sail, _anech, metallic=None)
wtex.assign_pbr(mat_metal, _submetal, metallic=0.75)

LOA = 95.0
hull_stations = [
    (-LOA * 0.48, 1.2, 1.0),
    (-LOA * 0.40, 3.4, 2.9),
    (-LOA * 0.35, 4.2, 3.6),
    (-LOA * 0.22, 5.1, 4.4),
    (-LOA * 0.15, 5.4, 4.6),
    (-LOA * 0.05, 5.55, 4.75),
    (0.0, 5.6, 4.8),
    (LOA * 0.10, 5.5, 4.7),
    (LOA * 0.18, 5.2, 4.5),
    (LOA * 0.28, 4.6, 4.0),
    (LOA * 0.35, 3.8, 3.4),
    (LOA * 0.42, 2.4, 2.2),
    (LOA * 0.45, 1.6, 1.5),
    (LOA * 0.495, 0.25, 0.25),
]

hull = build_hull_loft(hull_stations, segs=40, mat=mat_hull)

# Sonar dome
bpy.ops.mesh.primitive_uv_sphere_add(
    segments=24, ring_count=12, radius=2.2, location=(0, 0, LOA * 0.47)
)
dome = bpy.context.active_object
dome.name = "SonarDome"
dome.scale = (1.0, 0.85, 0.55)
bpy.ops.object.transform_apply(scale=True)
dome.data.materials.append(mat_rubber)
shade(dome)

# Fairing collar between dome and hull
add_cylinder("DomeCollar", (0, 0, LOA * 0.435), 2.05, 1.2, mat_hull, vertices=24)

# Sail loft — profiles seated on hull crown
sail_stations = []
for z, half_x, y_top_off in [
    (-9.0, 0.52, 3.0),
    (-6.5, 0.68, 5.8),
    (-3.5, 0.78, 8.2),
    (-0.5, 0.82, 9.6),
    (2.5, 0.62, 8.8),
    (5.5, 0.38, 6.2),
    (7.5, 0.14, 3.4),
]:
    y_base = hull_radius_at(z, hull_stations) * 0.98
    sail_stations.append((z, half_x, y_base, y_base + y_top_off))

build_sail_loft(sail_stations, mat_sail)

# Sail-plane (diving plane on sail)
add_box("SailPlane", (0, 6.8, 1.5), (2.6, 0.14, 0.9), mat_metal, 0.025)

# Forward diving planes
for side, x in (("L", -5.4), ("R", 5.4)):
    add_box(f"FwdPlane_{side}", (x, 0.15, LOA * 0.30), (3.4, 0.16, 1.5), mat_metal, 0.03)

# Aft stern planes (X-config)
for label, x, y in (("UR", 2.8, 2.8), ("UL", -2.8, 2.8), ("DR", 2.8, -2.8), ("DL", -2.8, -2.8)):
    add_box(
        f"SternPlane_{label}",
        (x, y, -LOA * 0.38),
        (1.8, 0.14, 1.1),
        mat_metal,
        0.025,
    )

# Torpedo tube doors (bow)
for i, x in enumerate((-1.8, -0.6, 0.6, 1.8)):
    add_cylinder(
        f"TubeDoor_{i}",
        (x, -0.4, LOA * 0.465),
        0.38,
        0.12,
        mat_dark,
        vertices=12,
        rotation=(math.radians(90), 0, 0),
    )

# Periscope + masts
add_cylinder("Periscope", (0.35, 5.2, -2.0), 0.14, 3.6, mat_metal, vertices=10)
add_cylinder("ECM_Mast", (-0.45, 5.0, -3.2), 0.08, 2.2, mat_metal, vertices=8)
add_box("BridgeFairing", (0, 5.6, -2.5), (0.9, 0.55, 1.6), mat_sail, 0.04)

# Screw hub + blades
add_cylinder("ScrewHub", (0, 0, -LOA * 0.485), 1.05, 1.8, mat_dark, vertices=20)
for i in range(7):
    ang = i / 7 * math.pi * 2
    bpy.ops.mesh.primitive_cube_add(size=1)
    blade = bpy.context.active_object
    blade.name = f"Blade_{i}"
    blade.scale = (0.14, 2.5, 0.52)
    blade.location = (math.cos(ang) * 1.35, math.sin(ang) * 1.35, -LOA * 0.50)
    blade.rotation_euler = (0, 0, ang)
    bpy.ops.object.transform_apply(scale=True, rotation=True)
    blade.data.materials.append(mat_metal)
    apply_bevel(blade, 0.02, 1)
    shade(blade)

# Propeller guard ring
bpy.ops.mesh.primitive_torus_add(
    major_radius=2.85, minor_radius=0.08, major_segments=28, minor_segments=6,
    location=(0, 0, -LOA * 0.495),
)
guard = bpy.context.active_object
guard.name = "PropGuard"
guard.data.materials.append(mat_metal)
shade(guard)

# World-scale UVs on every part (the loft/primitives ship none) so the tiling
# anechoic/metal maps read at a constant physical size — must happen BEFORE the
# join, while each part is still separate, or a single projection would smear one
# tile over the whole 95 m boat.
bpy.ops.object.mode_set(mode="OBJECT")
for o in [o for o in scene.objects if o.type == "MESH"]:
    uv_cube(o, 5.5)

# Join for single-mesh export
objs = [o for o in scene.objects if o.type == "MESH"]
for o in objs:
    o.select_set(True)
bpy.context.view_layer.objects.active = hull
bpy.ops.object.join()

joined = bpy.context.view_layer.objects.active
mesh = joined.data
mesh.calc_loop_triangles()
tri_count = len(mesh.loop_triangles)
print(f"Triangle estimate: {tri_count}")

export_kwargs = dict(
    export_format="GLB",
    use_selection=False,
    export_apply=True,
    export_yup=True,
)

for out_path in (OUT_PUBLIC, OUT_SRC):
    bpy.ops.export_scene.gltf(filepath=str(out_path), **export_kwargs)
    print("Wrote", out_path)
