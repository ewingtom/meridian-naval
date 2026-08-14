"""Close-framed turntable preview for SMALL furniture GLBs (console/chair) that
preview_glb.py mis-frames because it assumes ship scale.

  /Applications/Blender.app/Contents/MacOS/Blender --background \
    --python scripts/blender/preview_furniture.py -- <glb> <out_dir> [size] [views]

Views (named in glTF/ship-local axes, bow/front = +Z, up = +Y):
  front  = operator's view, camera on -Z looking toward +Z
  back    = behind the unit (+Z looking -Z)
  oper_q  = operator 3/4 from -Z/+X
  bow_q   = 3/4 from the +Z/+X (bow) side
  side    = pure +X beam
  above   = top-down-ish
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
SIZE = int(argv[2]) if len(argv) > 2 else 800
VIEWS = (argv[3].split(",") if len(argv) > 3 else
         ["front", "oper_q", "bow_q", "side", "back", "above"])

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
scene.render.resolution_y = int(SIZE * 0.8)
scene.render.film_transparent = False
if hasattr(scene.view_settings, "view_transform"):
    scene.view_settings.view_transform = "Standard"

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

world = bpy.data.worlds.new("W")
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs[0].default_value = (0.09, 0.11, 0.14, 1.0)   # dim CIC-like ambient
bg.inputs[1].default_value = 1.5

# key light
bpy.ops.object.light_add(type="AREA", location=(span, span * 1.4, span))
key = bpy.context.active_object
key.data.energy = 1500
key.data.size = span * 2
key.rotation_euler = (math.radians(52), math.radians(18), math.radians(-125))
# soft cool fill from the front (mimics the screen glow)
bpy.ops.object.light_add(type="AREA", location=(-span * 0.6, span * 0.5, -span))
fill = bpy.context.active_object
fill.data.energy = 600
fill.data.size = span * 3
fill.data.color = (0.55, 0.78, 1.0)

# ground
bpy.ops.mesh.primitive_plane_add(size=span * 12, location=(centre.x, lo[2], centre.z))
# NOTE: after glTF import, Blender Z is up (glTF +Y). Put floor at min Blender-Z.
floor = bpy.context.active_object
floor.location = (centre.x, centre.y, lo[2])
fm = bpy.data.materials.new("Floor")
fm.use_nodes = True
fb = fm.node_tree.nodes["Principled BSDF"]
fb.inputs["Base Color"].default_value = (0.03, 0.035, 0.04, 1.0)
fb.inputs["Roughness"].default_value = 0.8
floor.data.materials.append(fm)

bpy.ops.object.camera_add()
cam = bpy.context.active_object
scene.camera = cam
cam.data.lens = 42

# glTF->Blender remap after import: glTF +Z -> Blender -Y, glTF +Y -> Blender +Z,
# glTF +X -> Blender +X. Direction vectors below are written in BLENDER space.
DIRS = {
    "front":  (Vector((0.10, 1.15, 0.32)), 1.75),   # -Z gltf (operator) looking +Z
    "oper_q": (Vector((0.85, 1.0, 0.42)), 1.75),
    "bow_q":  (Vector((0.85, -1.0, 0.42)), 1.80),
    "side":   (Vector((1.30, 0.02, 0.22)), 1.70),
    "back":   (Vector((0.10, -1.15, 0.32)), 1.75),
    "above":  (Vector((0.35, 0.55, 1.15)), 1.85),
}
OUTDIR.mkdir(parents=True, exist_ok=True)
for name in VIEWS:
    d, mul = DIRS[name]
    look = centre.copy()
    cam.location = look + d.normalized() * span * mul
    direction = look - cam.location
    cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    scene.render.filepath = str(OUTDIR / f"{GLB.stem}_{name}.png")
    bpy.ops.render.render(write_still=True)
    print("RENDERED", scene.render.filepath)
