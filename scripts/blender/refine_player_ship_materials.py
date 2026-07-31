"""
Enhance MERIDIAN hero destroyer (player_ship.glb) paint materials.

Keeps geometry + object names intact; enhances existing baked atlases
(BK_HULL_*, BK_SS_*, BK_DET_*, BK_WPN_*) with panel seams, weathering,
roughness variation, and clearcoat-friendly Principled export.

Run:
  /Applications/Blender.app/Contents/MacOS/Blender --background \\
    --python scripts/blender/refine_player_ship_materials.py
"""
from __future__ import annotations

import math
import random
from pathlib import Path

import bpy
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
IN = ROOT / "public/assets/models/player_ship.glb"
OUT = IN
BACKUP = IN.with_suffix(".glb.bak")

# Atlas groups: (col_name, rgh_name, normal_name_or_None, is_paint_atlas)
ATLASES = [
    ("BK_HULL_col", "BK_HULL_rgh", "BK_HULL_nrm", True),
    ("BK_SS_col", "BK_SS_rgh", "BK_SS_nrm", True),
    ("BK_DET_col", "BK_DET_rgh", "BK_DET_nrm", True),
    ("BK_WPN_col", "BK_WPN_rgh", "BK_WPN_nrm", False),
]

PAINT_TINT = np.array([0.52, 0.54, 0.56], dtype=np.float32)  # haze grey
METAL_TINT = np.array([0.38, 0.40, 0.42], dtype=np.float32)

MOUNT_NAMES = {
    "Helm", "WeaponsStation", "GunBarrelTip", "Bridge_Glass",
}
MOUNT_PREFIXES = ("MissileTube", "CIWS")


def reset_scene() -> None:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)


def image_to_array(img: bpy.types.Image) -> np.ndarray:
    w, h = img.size
    px = np.array(img.pixels[:], dtype=np.float32).reshape(h, w, 4)
    return px


def array_to_image(img: bpy.types.Image, arr: np.ndarray) -> None:
    h, w = arr.shape[:2]
    if img.size[0] != w or img.size[1] != h:
        img.scale(w, h)
    img.pixels.foreach_set(arr.astype(np.float32).ravel())
    img.update()


def smooth_box(arr: np.ndarray, radius: int) -> np.ndarray:
    """Separable box blur for cheap AO-ish darkening."""
    a = arr.astype(np.float32)
    r = radius
    k = 2 * r + 1
    p = np.pad(a, ((0, 0), (r, r)), mode="edge")
    c = np.cumsum(np.concatenate([np.zeros((p.shape[0], 1), dtype=np.float32), p], axis=1), axis=1)
    horiz = (c[:, k : k + a.shape[1]] - c[:, 1 : 1 + a.shape[1]]) / k
    p = np.pad(horiz, ((r, r), (0, 0)), mode="edge")
    c = np.cumsum(np.concatenate([np.zeros((1, p.shape[1]), dtype=np.float32), p], axis=0), axis=0)
    return (c[k : k + a.shape[0], :] - c[1 : 1 + a.shape[0], :]) / k


def value_noise(h: int, w: int, scale: float, seed: int) -> np.ndarray:
    rng = np.random.default_rng(seed)
    gh = max(2, int(h / scale) + 2)
    gw = max(2, int(w / scale) + 2)
    grid = rng.random((gh, gw), dtype=np.float32)
    ys = np.linspace(0, gh - 1, h, dtype=np.float32)
    xs = np.linspace(0, gw - 1, w, dtype=np.float32)
    x0 = np.floor(xs).astype(int)
    y0 = np.floor(ys).astype(int)
    x1 = np.clip(x0 + 1, 0, gw - 1)
    y1 = np.clip(y0 + 1, 0, gh - 1)
    tx = xs - x0
    ty = ys - y0
    tx = tx[None, :]
    ty = ty[:, None]
    a = grid[y0[:, None], x0[None, :]]
    b = grid[y0[:, None], x1[None, :]]
    c = grid[y1[:, None], x0[None, :]]
    d = grid[y1[:, None], x1[None, :]]
    u = tx * tx * (3 - 2 * tx)
    v = ty * ty * (3 - 2 * ty)
    return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v


def panel_seam_mask(h: int, w: int, seed: int, horizontal_bias: float = 0.55) -> np.ndarray:
    """Irregular panel boundaries — not a regular grid."""
    rng = random.Random(seed)
    mask = np.zeros((h, w), dtype=np.float32)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    xx /= max(w - 1, 1)
    yy /= max(h - 1, 1)

    # Longitudinal frames (irregular spacing along ship length / U)
    x = 0.0
    while x < 1.0:
        x += rng.uniform(0.045, 0.11)
        width = rng.uniform(0.0012, 0.0028)
        mask = np.maximum(mask, np.exp(-((xx - x) ** 2) / (2 * width ** 2)))

    # Horizontal strakes (deck levels / plating bands)
    y = 0.0
    while y < 1.0:
        y += rng.uniform(0.06, 0.14)
        width = rng.uniform(0.0010, 0.0022)
        seam = np.exp(-((yy - y) ** 2) / (2 * width ** 2))
        mask = np.maximum(mask, seam * horizontal_bias)

    # Occasional oblique streaks (weathering / shadow lines)
    for _ in range(rng.randint(6, 11)):
        angle = rng.uniform(-0.35, 0.35)
        offset = rng.uniform(-0.2, 1.2)
        line = xx * math.sin(angle) + yy * math.cos(angle) - offset
        mask = np.maximum(mask, np.exp(-(line ** 2) / (2 * 0.0009 ** 2)) * 0.35)

    return np.clip(mask, 0, 1)


def weathering_streaks(h: int, w: int, seed: int) -> np.ndarray:
    rng = np.random.default_rng(seed + 17)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    xx /= max(w - 1, 1)
    # Vertical rust/wash streaks with noise wobble
    wobble = value_noise(h, w, 48, seed + 3) * 0.04
    streaks = np.zeros((h, w), dtype=np.float32)
    for i in range(18):
        x = float(rng.uniform(0.02, 0.98))
        width = float(rng.uniform(0.004, 0.012))
        strength = float(rng.uniform(0.15, 0.45))
        fall = np.exp(-((xx + wobble - x) ** 2) / (2 * width ** 2))
        # stronger toward lower hull (bottom of atlas)
        fall *= (0.35 + 0.65 * (1.0 - yy))
        streaks = np.maximum(streaks, fall * strength)
    salt = value_noise(h, w, 6, seed + 5)
    streaks += (salt - 0.5) * 0.08
    return np.clip(streaks, 0, 1)


def enhance_albedo(col: np.ndarray, seed: int, is_paint: bool) -> np.ndarray:
    h, w = col.shape[:2]
    rgb = col[..., :3].copy()
    alpha = col[..., 3:4]

    # Lift flat mid-grey dead zones while preserving existing baked variation
    lum = rgb.mean(axis=2, keepdims=True)
    has_detail = lum.std() > 0.02
    if has_detail:
        rgb = np.clip(rgb * 1.08 + 0.02, 0, 1)
    else:
        tint = PAINT_TINT if is_paint else METAL_TINT
        rgb = np.clip(rgb * 0.25 + tint * 0.75, 0, 1)

    seams = panel_seam_mask(h, w, seed, horizontal_bias=0.7 if is_paint else 0.45)
    streaks = weathering_streaks(h, w, seed) if is_paint else weathering_streaks(h, w, seed) * 0.35

    # Darken recesses from blurred inverse luminance (fake cavity AO)
    inv = 1.0 - lum[..., 0]
    ao = smooth_box(inv, max(2, min(h, w) // 128))
    ao = np.clip((ao - ao.min()) / max(ao.max() - ao.min(), 1e-4), 0, 1)

    rgb *= 1.0 - seams[..., None] * (0.18 if is_paint else 0.12)
    rgb *= 1.0 - ao[..., None] * 0.14
    rgb *= 1.0 - streaks[..., None] * 0.10

    # Subtle paint mottling
    mottle = value_noise(h, w, 22, seed + 9)
    rgb *= 0.97 + mottle[..., None] * 0.06

    # Warm sun-bleach on upper surfaces (top of V in UV)
    yy = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    bleach = (1.0 - yy) * 0.04
    rgb[..., 0] += bleach
    rgb[..., 1] += bleach * 0.95
    rgb[..., 2] += bleach * 0.85

    return np.clip(np.concatenate([rgb, alpha], axis=2), 0, 1)


def enhance_roughness(rgh: np.ndarray, col: np.ndarray, seed: int, is_paint: bool) -> np.ndarray:
    h, w = rgh.shape[:2]
    # Existing export stores roughness in green channel; often flat constant
    base = rgh[..., 1].copy()
    if base.std() < 0.01:
        base[:] = 0.62 if is_paint else 0.48

    lum = col[..., :3].mean(axis=2)
    seams = panel_seam_mask(h, w, seed + 101)
    streaks = weathering_streaks(h, w, seed + 103)
    micro = value_noise(h, w, 14, seed + 107)

    rough = base
    rough += (micro - 0.5) * (0.14 if is_paint else 0.10)
    rough += seams * (0.12 if is_paint else 0.08)
    rough += streaks * 0.06
    rough += (1.0 - lum) * 0.08  # darker areas slightly rougher
    rough = np.clip(rough, 0.38 if is_paint else 0.22, 0.82 if is_paint else 0.65)

    out = rgh.copy()
    out[..., 0] = 1.0  # glTF metallic in R when packed — keep non-metallic
    out[..., 1] = rough
    out[..., 2] = 1.0
    out[..., 3] = 1.0
    return out


def normal_from_height(height: np.ndarray, strength: float = 1.6) -> np.ndarray:
    h, w = height.shape
    padded = np.pad(height, 1, mode="edge")
    dx = (padded[1:-1, 2:] - padded[1:-1, :-2]) * strength
    dy = (padded[2:, 1:-1] - padded[:-2, 1:-1]) * strength
    nx = -dx
    ny = -dy
    nz = np.ones_like(nx)
    n = np.stack([nx, ny, nz], axis=2)
    n /= np.maximum(np.linalg.norm(n, axis=2, keepdims=True), 1e-4)
    rgb = (n * 0.5 + 0.5).astype(np.float32)
    return np.concatenate([rgb, np.ones((h, w, 1), dtype=np.float32)], axis=2)


def ensure_normal_image(name: str, ref: bpy.types.Image) -> bpy.types.Image:
    img = bpy.data.images.get(name)
    if img is None:
        img = bpy.data.images.new(name, ref.size[0], ref.size[1], alpha=True)
    return img


def upgrade_material_nodes(mat: bpy.types.Material, nrm_name: str | None, is_paint: bool) -> None:
    if not mat.use_nodes or mat.node_tree is None:
        return
    nt = mat.node_tree
    bsdf = next((n for n in nt.nodes if n.type == "BSDF_PRINCIPLED"), None)
    if bsdf is None:
        return

    # Clearcoat-friendly export values (glTF KHR_materials_clearcoat)
    coat = bsdf.inputs.get("Coat Weight") or bsdf.inputs.get("Clearcoat")
    if coat and is_paint:
        coat.default_value = 0.22
    coat_r = bsdf.inputs.get("Coat Roughness") or bsdf.inputs.get("Clearcoat Roughness")
    if coat_r and is_paint:
        coat_r.default_value = 0.28

    spec = bsdf.inputs.get("Specular IOR Level") or bsdf.inputs.get("Specular")
    if spec:
        spec.default_value = 0.45 if is_paint else 0.55

    base = bsdf.inputs.get("Base Color")
    if base and not base.is_linked:
        base.default_value = (1.0, 1.0, 1.0, 1.0)

    if not nrm_name:
        return
    nrm_img = bpy.data.images.get(nrm_name)
    if nrm_img is None:
        return

    # Skip if normal already wired
    normal_in = bsdf.inputs.get("Normal")
    if normal_in and normal_in.is_linked:
        return

    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.name = "Normal Map"
    tex.label = "Normal Map"
    tex.image = nrm_img
    tex.image.colorspace_settings.name = "Non-Color"
    tex.location = (-300, -300)

    nmap = nt.nodes.new("ShaderNodeNormalMap")
    nmap.location = (-80, -280)
    nt.links.new(tex.outputs["Color"], nmap.inputs["Color"])
    nt.links.new(nmap.outputs["Normal"], normal_in)


def classify_material(name: str) -> tuple[bool, bool]:
    n = name.lower()
    is_glass = "glass" in n or n.startswith("light_")
    is_paint = not is_glass and (
        "paint" in n or "hull" in n or "nonskid" in n or "deck" in n
        or "antifoul" in n or "boot" in n or "ss_" in n or "radome" in n
    )
    is_metal = "metal" in n or "gun" in n or "bronze" in n
    return is_paint, is_metal


def atlas_for_material(mat_name: str) -> tuple[str, str, str] | None:
    if "__HULL" in mat_name:
        return ATLASES[0][:3]
    if "__SS" in mat_name:
        return ATLASES[1][:3]
    if "__DET" in mat_name:
        return ATLASES[2][:3]
    if "__WPN" in mat_name:
        return ATLASES[3][:3]
    return None


def snapshot_mount_names() -> list[str]:
    names = []
    for obj in bpy.data.objects:
        if obj.name in MOUNT_NAMES or any(obj.name.startswith(p) for p in MOUNT_PREFIXES):
            names.append(obj.name)
    return names


def main() -> None:
    if not IN.exists():
        raise FileNotFoundError(IN)

    reset_scene()
    bpy.ops.import_scene.gltf(filepath=str(IN))
    before_mounts = snapshot_mount_names()

    enhanced = []
    for idx, (col_name, rgh_name, nrm_name, is_paint_atlas) in enumerate(ATLASES):
        col_img = bpy.data.images.get(col_name)
        rgh_img = bpy.data.images.get(rgh_name)
        if col_img is None or rgh_img is None:
            print("SKIP atlas missing:", col_name, rgh_name)
            continue

        col = image_to_array(col_img)
        rgh = image_to_array(rgh_img)
        seed = 42 + idx * 1000

        new_col = enhance_albedo(col, seed, is_paint_atlas)
        new_rgh = enhance_roughness(rgh, new_col, seed, is_paint_atlas)
        array_to_image(col_img, new_col)
        array_to_image(rgh_img, new_rgh)

        # Normal from composite height (seams + AO + micro noise)
        h_src = (
            panel_seam_mask(col.shape[0], col.shape[1], seed + 7)
            + (1.0 - new_col[..., :3].mean(axis=2)) * 0.5
            + value_noise(col.shape[0], col.shape[1], 18, seed + 11) * 0.25
        )
        nrm = normal_from_height(h_src, strength=2.2 if is_paint_atlas else 1.4)
        nrm_img = ensure_normal_image(nrm_name, col_img)
        array_to_image(nrm_img, nrm)
        nrm_img.colorspace_settings.name = "Non-Color"

        enhanced.append(col_name)
        print(f"ENHANCED {col_name} / {rgh_name} / {nrm_name}")

    for img in bpy.data.images:
        if img.size[0] > 0 and img.pixels:
            img.pack()

    for mat in bpy.data.materials:
        is_paint, is_metal = classify_material(mat.name)
        atlas = atlas_for_material(mat.name)
        nrm = atlas[2] if atlas else None
        if is_paint or is_metal:
            upgrade_material_nodes(mat, nrm, is_paint)

    # Preserve object names (export strips .001 duplicates from import)
    for obj in bpy.data.objects:
        if obj.name.endswith(".001"):
            base = obj.name[:-4]
            if bpy.data.objects.get(base) is None:
                obj.name = base

    if not BACKUP.exists():
        import shutil
        shutil.copy2(IN, BACKUP)
        print("BACKUP", BACKUP)

    bpy.ops.export_scene.gltf(
        filepath=str(OUT),
        export_format="GLB",
        export_apply=False,
        export_yup=True,
        export_materials="EXPORT",
        export_image_format="AUTO",
        export_texcoords=True,
        export_normals=True,
    )

    after_mounts = snapshot_mount_names()
    size_mb = OUT.stat().st_size / (1024 * 1024)
    print("EXPORTED", OUT, f"{size_mb:.2f} MB")
    print("MOUNT POINTS before:", before_mounts or "(none in source)")
    print("MOUNT POINTS after:", after_mounts or "(none in source)")
    print("ATLASES ENHANCED:", enhanced)


if __name__ == "__main__":
    main()
