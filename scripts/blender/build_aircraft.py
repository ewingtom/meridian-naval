"""
Build a high-detail hostile strike aircraft GLB for MERIDIAN.
Forward = +Z. Run:
  /Applications/Blender.app/Contents/MacOS/Blender --background --python scripts/blender/build_aircraft.py
"""
import bpy
import bmesh
import math
from pathlib import Path

OUT_PUBLIC = Path("/Users/tje/games/warship/public/assets/models/enemy_aircraft.glb")
OUT_SRC = Path("/Users/tje/games/warship/src/assets/models/enemy_aircraft.glb")
for out in (OUT_PUBLIC, OUT_SRC):
    out.parent.mkdir(parents=True, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
for obj in list(bpy.data.objects):
    bpy.data.objects.remove(obj, do_unlink=True)

scene = bpy.context.scene


def new_mat(name, color, roughness=0.45, metallic=0.35):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    if "Metallic" in bsdf.inputs:
        bsdf.inputs["Metallic"].default_value = metallic
    return mat


def new_skin_mat(name, base_color, panel_dark=None, roughness=0.42, metallic=0.38):
    """Aircraft skin with subtle panel-line banding."""
    if panel_dark is None:
        panel_dark = tuple(c * 0.74 for c in base_color)
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
    wave_z.inputs["Scale"].default_value = 22.0
    wave_z.inputs["Detail"].default_value = 0.0

    wave_x = nodes.new("ShaderNodeTexWave")
    wave_x.wave_type = "BANDS"
    wave_x.bands_direction = "X"
    wave_x.inputs["Scale"].default_value = 6.0
    wave_x.inputs["Detail"].default_value = 1.2
    wave_x.inputs["Detail Scale"].default_value = 1.0

    combine = nodes.new("ShaderNodeMath")
    combine.operation = "MAXIMUM"

    ramp = nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.46
    ramp.color_ramp.elements[1].position = 0.54

    mix = nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.inputs["A"].default_value = (*base_color, 1.0)
    mix.inputs["B"].default_value = (*panel_dark, 1.0)
    mix.inputs["Factor"].default_value = 0.32

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


def apply_bevel(obj, width=0.03, segments=2):
    mod = obj.modifiers.new("Bevel", "BEVEL")
    mod.width = width
    mod.segments = segments
    mod.limit_method = "ANGLE"
    mod.angle_limit = math.radians(30)
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


def mesh_from_bmesh(name, bm, mat=None):
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    obj = link(bpy.data.objects.new(name, mesh))
    if mat:
        obj.data.materials.append(mat)
    return obj


def add_box(name, loc, scale, mat, bevel=0.03, bevel_seg=2):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(scale=True)
    obj.data.materials.append(mat)
    if bevel:
        apply_bevel(obj, bevel, bevel_seg)
    shade(obj)
    return obj


def add_cylinder(name, loc, radius, depth, mat, vertices=16, rotation=(0, 0, 0), bevel=0.0):
    bpy.ops.mesh.primitive_cylinder_add(
        radius=radius, depth=depth, vertices=vertices, location=loc, rotation=rotation
    )
    obj = bpy.context.active_object
    obj.name = name
    obj.data.materials.append(mat)
    if bevel:
        apply_bevel(obj, bevel, 2)
    shade(obj)
    return obj


def build_fuselage_loft(stations, segs, mat):
    bm = bmesh.new()
    rings = []
    for z, rx, ry, y_off in stations:
        ring = []
        for i in range(segs):
            a = (i / segs) * math.pi * 2.0
            x = math.cos(a) * rx
            y = math.sin(a) * ry + y_off
            # flatten belly slightly
            if y < y_off:
                y *= 0.88
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

    fuse = mesh_from_bmesh("Fuselage", bm, mat)
    apply_bevel(fuse, 0.035, 2)
    shade(fuse, 32)
    return fuse


def build_intake(name, loc, mat_outer, mat_inner):
    """Side intake tunnel with lip and inner dark tunnel."""
    add_box(f"{name}_Duct", loc, (0.55, 1.1, 2.0), mat_outer, 0.04, 2)
    inner_loc = (loc[0], loc[1] - 0.08, loc[2] - 0.15)
    add_box(f"{name}_Tunnel", inner_loc, (0.38, 0.85, 1.6), mat_inner, 0.02, 1)
    lip_loc = (loc[0], loc[1] + 0.42, loc[2] + 0.85)
    add_cylinder(
        f"{name}_Lip",
        lip_loc,
        0.52,
        0.18,
        mat_outer,
        vertices=14,
        rotation=(math.radians(90), 0, 0),
        bevel=0.015,
    )


def build_missile(name, loc, rotation, mat_body, mat_warhead):
    """Simple AGM under-wing stores."""
    body = add_cylinder(
        f"{name}_Body",
        loc,
        0.11,
        1.6,
        mat_body,
        vertices=10,
        rotation=rotation,
        bevel=0.01,
    )
    # warhead nose
    tip_z = loc[2] + 0.95 * math.cos(rotation[1])
    tip_y = loc[1] + 0.95 * math.sin(rotation[0]) if len(rotation) > 0 else loc[1]
    bpy.ops.mesh.primitive_cone_add(
        radius1=0.11, radius2=0.02, depth=0.35, location=(loc[0], loc[1], loc[2] + 0.88)
    )
    nose = bpy.context.active_object
    nose.name = f"{name}_Nose"
    nose.rotation_euler = rotation
    bpy.ops.object.transform_apply(rotation=True)
    nose.data.materials.append(mat_warhead)
    shade(nose)
    # tail fins
    for i, ang in enumerate((0, math.pi / 2)):
        fin_loc = (loc[0], loc[1], loc[2] - 0.65)
        add_box(
            f"{name}_Fin_{i}",
            fin_loc,
            (0.02, 0.22, 0.14),
            mat_body,
            0.008,
            1,
        )
    return body


# Materials
mat_skin = new_skin_mat("AirSkin", (0.36, 0.38, 0.40))
mat_dark = new_mat("AirDark", (0.07, 0.08, 0.09), 0.62, 0.22)
mat_glass = new_mat("Canopy", (0.04, 0.07, 0.11), 0.06, 0.08)
mat_metal = new_mat("AirMetal", (0.52, 0.53, 0.55), 0.28, 0.88)
mat_radar = new_mat("Radar", (0.12, 0.14, 0.16), 0.35, 0.55)
mat_missile = new_mat("MissileBody", (0.28, 0.30, 0.32), 0.45, 0.5)
mat_warhead = new_mat("MissileNose", (0.18, 0.19, 0.20), 0.4, 0.6)

# Fuselage — twin-engine strike fighter profile
fuse_stations = [
    (-8.5, 0.08, 0.08, 0.0),
    (-7.0, 0.22, 0.20, 0.0),
    (-5.5, 0.58, 0.52, 0.05),
    (-3.5, 0.82, 0.72, 0.08),
    (-1.0, 0.92, 0.82, 0.10),
    (1.5, 0.88, 0.78, 0.08),
    (3.5, 0.78, 0.68, 0.05),
    (5.5, 0.62, 0.55, 0.02),
    (7.0, 0.42, 0.38, 0.0),
    (8.5, 0.22, 0.22, 0.0),
    (9.8, 0.10, 0.10, 0.0),
]
fuse = build_fuselage_loft(fuse_stations, segs=32, mat=mat_skin)

# Radar nose cone
bpy.ops.mesh.primitive_cone_add(
    radius1=0.55, radius2=0.08, depth=1.6, location=(0, 0.05, -9.3)
)
nose = bpy.context.active_object
nose.name = "RadarNose"
nose.rotation_euler = (math.radians(-90), 0, 0)
bpy.ops.object.transform_apply(rotation=True)
nose.data.materials.append(mat_radar)
shade(nose)

# ---------------------------------------------------------------------------
# Lifting surfaces
#
# These used to be scaled cubes (`wing.scale = (5.8, 0.11, 2.2)`) with a couple
# of vertices nudged for sweep. At any angle where light grazed the surface that
# read as exactly what it was — a flat plank with a hard edge — and it was the
# single most obviously-procedural thing in the game.
#
# Every flying surface is now lofted from a real NACA 4-digit symmetric section,
# so it has a rounded leading edge, a proper thickness distribution peaking near
# 30% chord, and a sharp trailing edge. That silhouette is what actually sells
# "aircraft" at the ranges this model is seen from, far more than panel-line
# detail does.
# ---------------------------------------------------------------------------

def naca_symmetric(t, n=22):
    """Half-thickness profile of a NACA 00xx section, sampled with a cosine
    spacing so points cluster at the leading edge where curvature is highest.
    Returns [(x_fraction_of_chord, half_thickness_fraction), ...]."""
    pts = []
    for i in range(n):
        beta = math.pi * i / (n - 1)
        x = (1.0 - math.cos(beta)) * 0.5
        y = 5 * t * (0.2969 * math.sqrt(x) - 0.1260 * x - 0.3516 * x * x
                     + 0.2843 * x ** 3 - 0.1015 * x ** 4)
        pts.append((x, y))
    pts[-1] = (1.0, 0.0)  # close the trailing edge to a true point
    return pts


def build_airfoil_surface(name, mat, *, root_chord, tip_chord, span,
                          sweep, thickness, dihedral=0.0, twist=0.0,
                          root_pos=(0.0, 0.0, 0.0), mirror=False,
                          sections=6, tip_round=True):
    """Loft a wing/stabiliser from root to tip out of NACA sections.

    Ship-local axes here match the rest of this project's Blender authoring
    space: +Z is forward (nose), +Y is up, +X is starboard. Span therefore runs
    along X, chord along Z, and thickness along Y.
    """
    verts, faces = [], []
    ring_len = None
    for s in range(sections):
        f = s / (sections - 1)
        # Elliptical planform taper reads far more like a real wing than the
        # straight linear taper this had before.
        chord = root_chord + (tip_chord - root_chord) * (1.0 - math.sqrt(1.0 - f * f))
        x = span * f * (-1.0 if mirror else 1.0)
        y = math.sin(math.radians(dihedral)) * span * f
        z = -sweep * f
        tw = math.radians(twist * f)
        prof = naca_symmetric(thickness, 22)
        ring = []
        # Upper surface fore->aft, then lower surface aft->fore, so the ring is
        # a single closed loop the quad-strip below can walk.
        for sgn in (1, -1):
            seq = prof if sgn > 0 else list(reversed(prof[1:-1]))
            for (cx, cy) in seq:
                lz = (0.5 - cx) * chord          # +Z forward => LE at +chord/2
                ly = cy * sgn * chord
                rz = lz * math.cos(tw) - ly * math.sin(tw)
                ry = lz * math.sin(tw) + ly * math.cos(tw)
                ring.append((x + root_pos[0], y + ry + root_pos[1], z + rz + root_pos[2]))
        if ring_len is None:
            ring_len = len(ring)
        base = len(verts)
        verts.extend(ring)
        if s > 0:
            prev = base - ring_len
            for i in range(ring_len):
                j = (i + 1) % ring_len
                # Wind consistently outward on both wings; mirroring the span
                # flips handedness, so flip the quad to keep normals out.
                q = (prev + i, prev + j, base + j, base + i)
                faces.append(q[::-1] if mirror else q)
    if tip_round:
        tip_base = len(verts) - ring_len
        cap = tuple(range(tip_base, tip_base + ring_len))
        faces.append(cap if mirror else cap[::-1])
    root_ring = tuple(range(0, ring_len))
    faces.append(root_ring[::-1] if mirror else root_ring)

    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.validate()
    obj = bpy.data.objects.new(name, mesh)
    link(obj)
    obj.data.materials.append(mat)
    shade(obj, 40)
    return obj


# Main wings — moderate sweep, elliptical taper, 9% thickness, 4 deg dihedral.
for side, mirror in (("L", True), ("R", False)):
    build_airfoil_surface(
        f"Wing_{side}", mat_skin,
        root_chord=3.4, tip_chord=1.15, span=5.7, sweep=2.05,
        thickness=0.09, dihedral=4.0, twist=-2.0,
        root_pos=(0.15 * (-1 if mirror else 1), -0.05, 0.35), mirror=mirror,
        sections=7,
    )

# LERX (leading-edge root extensions) — thin, highly swept, blends wing to body.
for side, mirror in (("L", True), ("R", False)):
    build_airfoil_surface(
        f"LERX_{side}", mat_skin,
        root_chord=3.1, tip_chord=1.5, span=1.05, sweep=1.25,
        thickness=0.05, dihedral=0.0,
        root_pos=(0.42 * (-1 if mirror else 1), 0.18, 2.1), mirror=mirror,
        sections=4, tip_round=False,
    )

# Canopy
bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=10, radius=0.52, location=(0, 0.82, 1.6))
canopy = bpy.context.active_object
canopy.name = "Canopy"
canopy.scale = (0.72, 0.58, 1.35)
bpy.ops.object.transform_apply(scale=True)
canopy.data.materials.append(mat_glass)
shade(canopy)

# Cockpit frame arch
bpy.ops.mesh.primitive_torus_add(
    major_radius=0.48, minor_radius=0.035, major_segments=20, minor_segments=4,
    location=(0, 0.78, 2.05),
)
frame = bpy.context.active_object
frame.name = "CockpitFrame"
frame.scale = (0.75, 0.55, 1.0)
frame.rotation_euler = (math.radians(90), 0, 0)
bpy.ops.object.transform_apply(scale=True, rotation=True)
frame.data.materials.append(mat_metal)
shade(frame)

# Spine fairing
add_box("Spine", (0, 0.55, -0.5), (0.28, 0.22, 4.5), mat_skin, 0.03, 2)

# Twin canted vertical tails — built as airfoils lofted along Y (span = height)
# rather than X, then canted outboard, so the fins get the same rounded leading
# edge and sharp trailing edge as every other flying surface.
for side, sgn in (("L", -1), ("R", 1)):
    fin = build_airfoil_surface(
        f"VTail_{side}", mat_skin,
        root_chord=2.5, tip_chord=1.15, span=1.55, sweep=1.0,
        thickness=0.075, dihedral=0.0,
        root_pos=(0.0, 0.0, 0.0), mirror=False,
        sections=5,
    )
    # Stand the surface up (span X -> Y), then cant the fin outboard 22 deg.
    fin.rotation_euler = (0.0, 0.0, math.radians(90))
    bpy.ops.object.select_all(action="DESELECT")
    fin.select_set(True)
    bpy.context.view_layer.objects.active = fin
    bpy.ops.object.transform_apply(rotation=True)
    fin.rotation_euler = (0.0, 0.0, math.radians(-22 * sgn))
    fin.location = (sgn * 0.55, 0.72, -5.35)

# Horizontal stabilisers — same airfoil treatment as the main wing, with a touch
# of anhedral (negative dihedral) the way most twin-tail strike aircraft carry.
for side, mirror in (("L", True), ("R", False)):
    build_airfoil_surface(
        f"HStab_{side}", mat_skin,
        root_chord=1.9, tip_chord=0.72, span=1.75, sweep=0.72,
        thickness=0.07, dihedral=-6.0,
        root_pos=(0.35 * (-1 if mirror else 1), 0.35, -6.15), mirror=mirror,
        sections=5,
    )

# Side intakes
build_intake("Intake_L", (-0.82, 0.15, -1.2), mat_skin, mat_dark)
build_intake("Intake_R", (0.82, 0.15, -1.2), mat_skin, mat_dark)

# Center belly intake scoop
add_box("BellyScoop", (0, -0.42, -0.8), (0.45, 0.35, 1.4), mat_dark, 0.025, 2)

# Engine nacelle bumps
for side, x in (("L", -0.72), ("R", 0.72)):
    add_cylinder(
        f"Engine_{side}",
        (x, -0.15, -3.8),
        0.42,
        2.4,
        mat_dark,
        vertices=16,
        rotation=(math.radians(90), 0, 0),
        bevel=0.02,
    )

# Exhaust nozzles
for side, x in (("L", -0.68), ("R", 0.68)):
    add_cylinder(
        f"Nozzle_{side}",
        (x, -0.05, -8.2),
        0.32,
        0.55,
        mat_metal,
        vertices=14,
        rotation=(math.radians(90), 0, 0),
        bevel=0.015,
    )
    add_cylinder(
        f"NozzleInner_{side}",
        (x, -0.02, -8.45),
        0.22,
        0.25,
        mat_dark,
        vertices=12,
        rotation=(math.radians(90), 0, 0),
    )

# Wing pylons + missiles (inner + outer stations)
for side, x_sign in (("L", -1), ("R", 1)):
    for slot, span in (("In", 2.4), ("Out", 4.5)):
        pylon_x = x_sign * span
        add_box(f"Pylon_{side}_{slot}", (pylon_x, -0.15, -0.05), (0.11, 0.13, 0.75), mat_metal, 0.012, 1)
        build_missile(
            f"Missile_{side}_{slot}",
            (pylon_x, -0.22, -0.45),
            (math.radians(90), 0, 0),
            mat_missile,
            mat_warhead,
        )

# Fuselage access panels (subtle raised seams)
for z in (-4.5, -1.5, 2.0, 5.0):
    add_box(f"Panel_{z}", (0, 0.62, z), (0.32, 0.04, 1.1), mat_dark, 0.008, 1)

# Refueling probe / pitot details
add_cylinder("Pitot", (0.08, 0.12, -8.8), 0.025, 1.2, mat_metal, vertices=8)
add_box("Antenna", (0, 0.72, -4.2), (0.04, 0.18, 0.35), mat_metal, 0.008, 1)

# Join for single-mesh export
objs = [o for o in scene.objects if o.type == "MESH"]
for o in objs:
    o.select_set(True)
bpy.context.view_layer.objects.active = fuse
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
