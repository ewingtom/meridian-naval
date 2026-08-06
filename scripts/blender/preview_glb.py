"""Render turntable previews of an exported GLB so assets can be eyeballed
without launching the game.

  /Applications/Blender.app/Contents/MacOS/Blender --background \
    --python scripts/blender/preview_glb.py -- <glb> <out_dir> [size] [views]

Views are named after the ship-local axes THIS project authors to (bow = +Z,
up = +Y): bow_q / stern_q / beam / above / close.
"""
from __future__ import annotations

import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
GLB = Path(argv[0])
OUTDIR = Path(argv[1] if len(argv) > 1 else "/tmp")
SIZE = int(argv[2]) if len(argv) > 2 else 900
VIEWS = (argv[3].split(",") if len(argv) > 3 else
         ["bow_q", "stern_q", "side", "above", "close"])

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(GLB))

scene = bpy.context.scene
for eng in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE"):
    try:
        scene.render.engine = eng
        break
    except TypeError:
        continue
scene.render.resolution_x = SIZE
scene.render.resolution_y = int(SIZE * 0.62)
scene.render.film_transparent = False
scene.view_settings.view_transform = "Filmic" if hasattr(scene.view_settings, "view_transform") else "Standard"

meshes = [o for o in scene.objects if o.type == "MESH"]
lo = Vector((1e9, 1e9, 1e9))
hi = Vector((-1e9, -1e9, -1e9))
for o in meshes:
    for c in o.bound_box:
        w = o.matrix_world @ Vector(c)
        for k in range(3):
            lo[k] = min(lo[k], w[k])
            hi[k] = max(hi[k], w[k])
centre = (lo + hi) * 0.5
span = max(hi[k] - lo[k] for k in range(3))
print("BOUNDS", tuple(round(v, 2) for v in lo), tuple(round(v, 2) for v in hi))

# sky + sun
world = bpy.data.worlds.new("W")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs[0].default_value = (0.30, 0.45, 0.62, 1.0)
bg.inputs[1].default_value = 1.3

bpy.ops.object.light_add(type="SUN", location=(span, span, span))
sun = bpy.context.active_object
sun.data.energy = 4.5
sun.data.angle = math.radians(3.0)
sun.rotation_euler = (math.radians(52), math.radians(24), math.radians(-118))

# calm sea plane so the waterline reads correctly (assets are authored with the
# waterline at glTF Y = 0, which is Blender Z = 0 after the importer's remap)
bpy.ops.mesh.primitive_plane_add(size=span * 8, location=(centre.x, centre.y, 0.0))
sea = bpy.context.active_object
m = bpy.data.materials.new("Sea")
m.use_nodes = True
b = m.node_tree.nodes["Principled BSDF"]
b.inputs["Base Color"].default_value = (0.016, 0.045, 0.075, 1.0)
b.inputs["Roughness"].default_value = 0.16
sea.data.materials.append(m)

bpy.ops.object.camera_add()
cam = bpy.context.active_object
scene.camera = cam
cam.data.lens = 62

# Camera directions are in BLENDER space after the glTF import remap, where
# Blender -Y is the bow (glTF +Z), Blender X is the beam and Blender Z is up.
DIRS = {
    "bow_q":   (Vector((0.72, -1.05, 0.34)), 1.30),
    "stern_q": (Vector((-0.80, 0.95, 0.32)), 1.30),
    "side":    (Vector((1.40, 0.04, 0.14)), 1.15),
    "head_on": (Vector((0.06, -1.35, 0.16)), 1.20),
    "above":   (Vector((0.55, -0.72, 0.95)), 1.35),
    "close":   (Vector((0.65, -0.80, 0.22)), 0.52),
    "closeaft":(Vector((-0.70, 0.75, 0.26)), 0.48),
}
OUTDIR.mkdir(parents=True, exist_ok=True)
for name in VIEWS:
    d, mul = DIRS[name]
    look = centre.copy()
    if name == "close":
        look = Vector((centre.x, hi[1] * 0.62 + lo[1] * 0.38, centre.z + span * 0.06))
    elif name == "closeaft":
        look = Vector((centre.x, lo[1] * 0.60 + hi[1] * 0.40, centre.z + span * 0.10))
    cam.location = look + d.normalized() * span * mul
    direction = look - cam.location
    cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    scene.render.filepath = str(OUTDIR / f"{GLB.stem}_{name}.png")
    bpy.ops.render.render(write_still=True)
    print("RENDERED", scene.render.filepath)
