import bpy
from pathlib import Path

IN = Path('/Users/tje/games/warship/src/assets/models/enemy_destroyer.glb')
OUT = IN

bpy.ops.wm.read_factory_settings(use_empty=True)
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)

bpy.ops.import_scene.gltf(filepath=str(IN))

for obj in [o for o in bpy.data.objects if o.type == 'MESH']:
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    if len(obj.data.vertices) < 1200:
        mod = obj.modifiers.new('Sub', 'SUBSURF')
        mod.levels = 1
        mod.render_levels = 1
        try:
            bpy.ops.object.modifier_apply(modifier='Sub')
        except Exception as e:
            print('sub fail', obj.name, e)
    b = obj.modifiers.new('Bev', 'BEVEL')
    b.width = 0.035
    b.segments = 2
    try:
        bpy.ops.object.modifier_apply(modifier='Bev')
    except Exception as e:
        print('bev fail', obj.name, e)
    try:
        bpy.ops.object.shade_smooth(use_auto_smooth=True)
    except Exception:
        for p in obj.data.polygons:
            p.use_smooth = True
    obj.select_set(False)

tris = 0
for obj in bpy.data.objects:
    if obj.type == 'MESH':
        obj.data.calc_loop_triangles()
        tris += len(obj.data.loop_triangles)

bpy.ops.export_scene.gltf(filepath=str(OUT), export_format='GLB', export_apply=True, export_yup=True)
print('REFINED', OUT, 'tris', tris)
