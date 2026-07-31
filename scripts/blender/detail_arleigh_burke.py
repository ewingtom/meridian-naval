"""
!! OBSOLETE — DO NOT RUN !!  (superseded by the Flight IIA rebuild in build_arleigh_burke.py)

It exec()s the build script and then re-adds the OLD small deckhouse, undoing the full-beam superstructure.

Kept only for reference. Running this WILL silently regress the hero ship model.
`build_arleigh_burke.py` is the single source of truth for player_ship.glb.
To run anyway (you almost certainly should not), pass --force-obsolete.
"""
from __future__ import annotations
import sys as _sys
if "--force-obsolete" not in _sys.argv:
    raise SystemExit(
        "REFUSED: detail_arleigh_burke.py is obsolete and would regress player_ship.glb.\n"
        "  It exec()s the build script and then re-adds the OLD small deckhouse, undoing the full-beam superstructure.\n"
        "  Rebuild with: build_arleigh_burke.py\n"
        "  Override with --force-obsolete if you really mean it."
    )


import math
import subprocess
import sys
from pathlib import Path

import bpy

ROOT = Path("/Users/tje/games/warship")
OUT = ROOT / "public/assets/models/player_ship.glb"
BUILD = ROOT / "scripts/blender/build_arleigh_burke.py"

# Always rebuild base then detail in one Blender session via exec
ns: dict = {}
exec(BUILD.read_text(), ns)

# Re-grab helpers from the build namespace
scene = bpy.context.scene
add_box = ns["add_box"]
mat_super = ns["mat_super"]
mat_metal = ns["mat_metal"]
mat_deck = ns["mat_deck"]
mat_hull = ns["mat_hull"]
mat_radome = ns["mat_radome"]
DECK_Y = ns["DECK_Y"]
BEAM = ns["BEAM"]
LOA = ns["LOA"]
HALF = ns["HALF"]
bevel = ns["bevel"]
shade_smooth = ns["shade_smooth"]


def railing(z0, z1, x, y, segs=12):
    """Simple rail as thin boxes along Z."""
    length = abs(z1 - z0)
    mid = (z0 + z1) * 0.5
    add_box(f"Rail_{x:.1f}_{mid:.0f}", (x, y, mid), (0.06, 0.55, length * 0.48), mat_metal, 0.01)
    # stanchions
    for i in range(segs + 1):
        t = i / segs
        z = z0 * (1 - t) + z1 * t
        add_box(f"Stanch_{x:.1f}_{i}_{mid:.0f}", (x, y - 0.15, z), (0.05, 0.7, 0.05), mat_metal, 0.005)


# Side rails along main deck
railing(-HALF + 20, HALF - 20, -BEAM * 0.46, DECK_Y + 0.9, 16)
railing(-HALF + 20, HALF - 20, BEAM * 0.46, DECK_Y + 0.9, 16)

# Bridge wing rails
railing(8, 18, -BEAM * 0.32, DECK_Y + 11.2, 6)
railing(8, 18, BEAM * 0.32, DECK_Y + 11.2, 6)

# Extra deckhouse tiers for Burke massing
add_box("Deckhouse_Aft", (0, DECK_Y + 5.2, -22), (BEAM * 0.36, 1.8, 12), mat_super, 0.05)
add_box("BridgeWing_P", (-BEAM * 0.28, DECK_Y + 10.0, 12), (2.2, 1.2, 4.5), mat_super, 0.04)
add_box("BridgeWing_S", (BEAM * 0.28, DECK_Y + 10.0, 12), (2.2, 1.2, 4.5), mat_super, 0.04)

# Harpoon canisters / canister launchers amidships
for i, z in enumerate([-4, -7]):
    add_box(f"Harpoon_P_{i}", (-BEAM * 0.28, DECK_Y + 2.0, z), (1.6, 0.9, 2.2), mat_metal, 0.02)
    add_box(f"Harpoon_S_{i}", (BEAM * 0.28, DECK_Y + 2.0, z), (1.6, 0.9, 2.2), mat_metal, 0.02)

# RHIB cradle
add_box("RHIB", (-BEAM * 0.30, DECK_Y + 1.6, -12), (2.8, 1.1, 5.5), mat_deck, 0.03)

# More SPY bevel surrounds
add_box("SPY_Frame_Fwd", (0, DECK_Y + 8.2, 15.2), (BEAM * 0.24, 3.1, 0.35), mat_super, 0.02)

# Anchor / hawse detail at bow
add_box("Hawse_P", (-1.8, DECK_Y + 0.6, HALF - 8), (0.8, 0.8, 1.2), mat_metal, 0.02)
add_box("Hawse_S", (1.8, DECK_Y + 0.6, HALF - 8), (0.8, 0.8, 1.2), mat_metal, 0.02)

# Cleaner hull material push (ensure no tan)
for mat in (mat_hull, mat_super):
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if mat == mat_hull:
        bsdf.inputs["Base Color"].default_value = (0.36, 0.39, 0.43, 1.0)
    else:
        bsdf.inputs["Base Color"].default_value = (0.40, 0.43, 0.47, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.5

# Re-export
root = bpy.data.objects.get("Meridian_Burke")
tris = 0
for obj in scene.objects:
    if obj.type == "MESH" and obj.data:
        obj.data.calc_loop_triangles()
        tris += len(obj.data.loop_triangles)

bpy.ops.export_scene.gltf(
    filepath=str(OUT),
    export_format="GLB",
    use_selection=False,
    export_apply=True,
    export_yup=True,
)
print(f"DETAILED EXPORT {OUT} tris≈{tris}")
