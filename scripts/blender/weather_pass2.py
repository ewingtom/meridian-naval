"""
!! OBSOLETE — DO NOT RUN !!  (superseded by the clean modern-navy paint pass in build_arleigh_burke.py)

It re-applies heavy rust/salt weathering, which is exactly the 'looks like an older ship' problem that was reported.

Kept only for reference. Running this WILL silently regress the hero ship model.
`build_arleigh_burke.py` is the single source of truth for player_ship.glb.
To run anyway (you almost certainly should not), pass --force-obsolete.
"""
from __future__ import annotations
import sys as _sys
if "--force-obsolete" not in _sys.argv:
    raise SystemExit(
        "REFUSED: weather_pass2.py is obsolete and would regress player_ship.glb.\n"
        "  It re-applies heavy rust/salt weathering, which is exactly the 'looks like an older ship' problem that was reported.\n"
        "  Rebuild with: build_arleigh_burke.py\n"
        "  Override with --force-obsolete if you really mean it."
    )


import math
import random
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

import bpy
import numpy as np

from refine_player_ship_materials import (
    ATLASES,
    BACKUP,
    IN,
    MOUNT_NAMES,
    MOUNT_PREFIXES,
    OUT,
    array_to_image,
    atlas_for_material,
    classify_material,
    ensure_normal_image,
    image_to_array,
    normal_from_height,
    reset_scene,
    smooth_box,
    snapshot_mount_names,
    value_noise,
)

# Mid naval haze-grey — darker than pass-1 chalk white
PAINT_TINT = np.array([0.44, 0.46, 0.48], dtype=np.float32)
METAL_TINT = np.array([0.32, 0.34, 0.36], dtype=np.float32)
RUBBER_TINT = np.array([0.12, 0.12, 0.13], dtype=np.float32)

# Minimal seam hinting — organic only, no spreadsheet grid
SEAM_STRENGTH_PAINT = 0.04
SEAM_STRENGTH_METAL = 0.03


def organic_seam_hint(h: int, w: int, seed: int) -> np.ndarray:
    """Very subtle irregular breakup — not a regular panel grid."""
    rng = random.Random(seed)
    mask = np.zeros((h, w), dtype=np.float32)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    xx /= max(w - 1, 1)
    yy /= max(h - 1, 1)

    for _ in range(rng.randint(4, 7)):
        x = rng.uniform(0.05, 0.95)
        width = rng.uniform(0.0025, 0.006)
        mask = np.maximum(mask, np.exp(-((xx - x) ** 2) / (2 * width ** 2)) * rng.uniform(0.2, 0.5))

    for _ in range(rng.randint(3, 5)):
        y = rng.uniform(0.08, 0.92)
        width = rng.uniform(0.002, 0.005)
        mask = np.maximum(mask, np.exp(-((yy - y) ** 2) / (2 * width ** 2)) * rng.uniform(0.15, 0.4))

    wobble = value_noise(h, w, 64, seed + 2)
    mask *= 0.55 + wobble * 0.45
    return np.clip(mask, 0, 1)


def salt_streaks(h: int, w: int, seed: int) -> np.ndarray:
    """Vertical salt/wash-out streaks — lighter on upper hull."""
    rng = np.random.default_rng(seed + 31)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    xx /= max(w - 1, 1)
    yy /= max(h - 1, 1)
    wobble = value_noise(h, w, 36, seed + 33) * 0.035
    streaks = np.zeros((h, w), dtype=np.float32)
    for _ in range(28):
        x = float(rng.uniform(0.01, 0.99))
        width = float(rng.uniform(0.002, 0.009))
        strength = float(rng.uniform(0.25, 0.65))
        fall = np.exp(-((xx + wobble - x) ** 2) / (2 * width ** 2))
        fall *= 0.25 + 0.75 * (1.0 - yy)  # stronger toward deck / topsides
        streaks = np.maximum(streaks, fall * strength)
    micro = value_noise(h, w, 8, seed + 35)
    streaks += np.clip(micro - 0.55, 0, 1) * 0.12
    return np.clip(streaks, 0, 1)


def rust_weep(h: int, w: int, seed: int) -> tuple[np.ndarray, np.ndarray]:
    """Rust drips under fittings — returns (strength mask, rgb tint multiplier)."""
    rng = np.random.default_rng(seed + 41)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    xx /= max(w - 1, 1)
    yy /= max(h - 1, 1)
    strength = np.zeros((h, w), dtype=np.float32)
    for _ in range(22):
        x = float(rng.uniform(0.03, 0.97))
        y0 = float(rng.uniform(0.05, 0.55))
        width = float(rng.uniform(0.003, 0.011))
        drip_len = float(rng.uniform(0.08, 0.35))
        col = np.exp(-((xx - x) ** 2) / (2 * width ** 2))
        row = np.clip((yy - y0) / max(drip_len, 1e-4), 0, 1)
        row = (1.0 - row) * (yy >= y0).astype(np.float32)
        fall = col * row * float(rng.uniform(0.35, 0.85))
        strength = np.maximum(strength, fall)
    # warm rust tint
    tint = np.ones((h, w, 3), dtype=np.float32)
    tint[..., 0] = 1.08 + strength * 0.22
    tint[..., 1] = 0.92 - strength * 0.18
    tint[..., 2] = 0.82 - strength * 0.28
    return np.clip(strength, 0, 1), tint


def waterline_grime(h: int, w: int) -> tuple[np.ndarray, np.ndarray]:
    """Near-black wet antifouling — light/tan band read as underwater skirt (judge F40/41)."""
    yy = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    band = np.clip((yy - 0.72) / 0.28, 0, 1) ** 1.2
    band = np.broadcast_to(band, (h, w)).copy()
    tint = np.ones((h, w, 3), dtype=np.float32)
    tint[..., 0] = 0.12
    tint[..., 1] = 0.14
    tint[..., 2] = 0.15
    return band, tint


def sun_bleach(h: int, w: int) -> np.ndarray:
    yy = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    return np.broadcast_to((1.0 - yy) ** 1.6 * 0.09, (h, w)).copy()


def recess_dirt(h: int, w: int, lum: np.ndarray, seed: int) -> np.ndarray:
    inv = 1.0 - lum
    ao = smooth_box(inv, max(3, min(h, w) // 96))
    ao = np.clip((ao - ao.min()) / max(ao.max() - ao.min(), 1e-4), 0, 1)
    crevice = value_noise(h, w, 28, seed + 51)
    dirt = ao * (0.65 + crevice * 0.35)
    return np.clip(dirt, 0, 1)


def deck_wet_mask(h: int, w: int, lum: np.ndarray, seed: int) -> np.ndarray:
    """Approximate horizontal deck bands — glossier, slightly darker."""
    yy = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    bands = np.zeros((h, w), dtype=np.float32)
    rng = random.Random(seed + 61)
    y = 0.12
    while y < 0.88:
        y += rng.uniform(0.10, 0.22)
        width = rng.uniform(0.025, 0.055)
        band = np.exp(-((yy - y) ** 2) / (2 * width ** 2))
        bands = np.maximum(bands, band * rng.uniform(0.4, 0.9))
    bands *= np.clip(0.55 + lum * 0.45, 0, 1)
    return np.clip(bands, 0, 1)


def enhance_albedo_pass2(col: np.ndarray, seed: int, is_paint: bool) -> np.ndarray:
    h, w = col.shape[:2]
    rgb = col[..., :3].copy()
    alpha = col[..., 3:4]
    lum = rgb.mean(axis=2)

    # Pull overall tone toward mid haze-grey (darker than pass 1)
    tint = PAINT_TINT if is_paint else METAL_TINT
    rgb = np.clip(rgb * 0.72 + tint * 0.28, 0, 1)
    lum = rgb.mean(axis=2)

    seams = organic_seam_hint(h, w, seed) * (SEAM_STRENGTH_PAINT if is_paint else SEAM_STRENGTH_METAL)
    salt = salt_streaks(h, w, seed) if is_paint else salt_streaks(h, w, seed) * 0.25
    rust_str, rust_tint = rust_weep(h, w, seed) if is_paint else (np.zeros((h, w), np.float32), np.ones((h, w, 3), np.float32))
    wl_str, wl_tint = waterline_grime(h, w) if is_paint else (np.zeros((h, w), np.float32), np.ones((h, w, 3), np.float32))
    bleach = sun_bleach(h, w) if is_paint else sun_bleach(h, w) * 0.35
    dirt = recess_dirt(h, w, lum, seed)

    rgb *= 1.0 - seams[..., None]
    rgb *= 1.0 - dirt[..., None] * (0.22 if is_paint else 0.14)
    rgb *= rust_tint
    rgb *= wl_tint
    rgb *= 1.0 - wl_str[..., None] * 0.28
    rgb += rust_str[..., None] * np.array([0.06, 0.01, -0.02], dtype=np.float32)
    rgb += salt[..., None] * np.array([0.07, 0.07, 0.06], dtype=np.float32)
    rgb += bleach[..., None]

    mottle = value_noise(h, w, 18, seed + 9)
    rgb *= 0.94 + mottle[..., None] * 0.10

    return np.clip(np.concatenate([rgb, alpha], axis=2), 0, 1)


def enhance_roughness_pass2(
    rgh: np.ndarray, col: np.ndarray, seed: int, is_paint: bool
) -> np.ndarray:
    h, w = rgh.shape[:2]
    base = rgh[..., 1].copy()
    if base.std() < 0.01:
        base[:] = 0.64 if is_paint else 0.42

    lum = col[..., :3].mean(axis=2)
    micro = value_noise(h, w, 12, seed + 107)
    seams = organic_seam_hint(h, w, seed + 101) * 0.5
    salt = salt_streaks(h, w, seed + 103)
    dirt = recess_dirt(h, w, lum, seed + 105)
    deck = deck_wet_mask(h, w, lum, seed) if is_paint else np.zeros((h, w), np.float32)

    rough = base.copy()
    rough += (micro - 0.5) * (0.18 if is_paint else 0.12)
    rough += seams * (0.08 if is_paint else 0.05)
    rough += dirt * (0.14 if is_paint else 0.08)
    rough += salt * 0.04
    rough -= deck * 0.22  # wet deck glossier
    rough += (1.0 - lum) * 0.06

    lo = 0.42 if is_paint else 0.18
    hi = 0.86 if is_paint else 0.62
    rough = np.clip(rough, lo, hi)

    out = rgh.copy()
    out[..., 0] = 1.0
    out[..., 1] = rough
    out[..., 2] = 1.0
    out[..., 3] = 1.0
    return out


def upgrade_material_nodes_pass2(mat: bpy.types.Material, nrm_name: str | None) -> None:
    if not mat.use_nodes or mat.node_tree is None:
        return
    nt = mat.node_tree
    bsdf = next((n for n in nt.nodes if n.type == "BSDF_PRINCIPLED"), None)
    if bsdf is None:
        return

    n = mat.name.lower()
    is_glass = "glass" in n or n.startswith("light_")
    is_rubber = "rubber" in n or "boot" in n or "fender" in n
    is_metal = "metal" in n or "gun" in n or "bronze" in n or "wpn" in n
    is_paint = not (is_glass or is_rubber or is_metal) and (
        "paint" in n or "hull" in n or "nonskid" in n or "deck" in n
        or "ss_" in n or "radome" in n or "antifoul" in n
    )

    def _set(name: str, val: float) -> None:
        sock = bsdf.inputs.get(name)
        if sock is not None:
            sock.default_value = val

    if is_glass:
        _set("Roughness", 0.06)
        _set("Specular IOR Level", 0.85)
        trans = bsdf.inputs.get("Transmission Weight") or bsdf.inputs.get("Transmission")
        if trans:
            trans.default_value = 0.92
        ior = bsdf.inputs.get("IOR")
        if ior:
            ior.default_value = 1.48
        base = bsdf.inputs.get("Base Color")
        if base and not base.is_linked:
            base.default_value = (0.55, 0.62, 0.68, 1.0)
    elif is_rubber:
        _set("Roughness", 0.88)
        _set("Specular IOR Level", 0.25)
        metallic = bsdf.inputs.get("Metallic")
        if metallic:
            metallic.default_value = 0.0
        base = bsdf.inputs.get("Base Color")
        if base and not base.is_linked:
            base.default_value = (*RUBBER_TINT.tolist(), 1.0)
    elif is_metal:
        _set("Roughness", 0.32)
        _set("Specular IOR Level", 0.62)
        metallic = bsdf.inputs.get("Metallic")
        if metallic:
            metallic.default_value = 1.0
        base = bsdf.inputs.get("Base Color")
        if base and not base.is_linked:
            base.default_value = (*METAL_TINT.tolist(), 1.0)
    elif is_paint:
        coat = bsdf.inputs.get("Coat Weight") or bsdf.inputs.get("Clearcoat")
        if coat:
            coat.default_value = 0.18
        coat_r = bsdf.inputs.get("Coat Roughness") or bsdf.inputs.get("Clearcoat Roughness")
        if coat_r:
            coat_r.default_value = 0.32
        _set("Roughness", 0.68)
        _set("Specular IOR Level", 0.42)

    if not nrm_name:
        return
    nrm_img = bpy.data.images.get(nrm_name)
    if nrm_img is None:
        return
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
        seed = 9001 + idx * 1000

        new_col = enhance_albedo_pass2(col, seed, is_paint_atlas)
        new_rgh = enhance_roughness_pass2(rgh, new_col, seed, is_paint_atlas)
        array_to_image(col_img, new_col)
        array_to_image(rgh_img, new_rgh)

        h_src = (
            organic_seam_hint(col.shape[0], col.shape[1], seed + 7) * 0.35
            + recess_dirt(col.shape[0], col.shape[1], new_col[..., :3].mean(axis=2), seed + 11) * 0.55
            + salt_streaks(col.shape[0], col.shape[1], seed + 13) * 0.25
            + value_noise(col.shape[0], col.shape[1], 16, seed + 15) * 0.30
        )
        nrm = normal_from_height(h_src, strength=2.6 if is_paint_atlas else 1.6)
        nrm_img = ensure_normal_image(nrm_name, col_img)
        array_to_image(nrm_img, nrm)
        nrm_img.colorspace_settings.name = "Non-Color"

        enhanced.append(col_name)
        print(f"PASS2 {col_name} / {rgh_name} / {nrm_name}")

    for img in bpy.data.images:
        if img.size[0] > 0 and img.pixels:
            img.pack()

    for mat in bpy.data.materials:
        atlas = atlas_for_material(mat.name)
        nrm = atlas[2] if atlas else None
        upgrade_material_nodes_pass2(mat, nrm)

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
    print("ATLASES PASS2:", enhanced)


if __name__ == "__main__":
    main()
