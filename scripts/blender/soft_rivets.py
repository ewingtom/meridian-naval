"""
!! OBSOLETE — DO NOT RUN !!  (superseded by the clean modern-navy paint pass in build_arleigh_burke.py)

It operates on the weather_pass2 rust atlases, which no longer exist in the current clean-paint model.

Kept only for reference. Running this WILL silently regress the hero ship model.
`build_arleigh_burke.py` is the single source of truth for player_ship.glb.
To run anyway (you almost certainly should not), pass --force-obsolete.
"""
from __future__ import annotations
import sys as _sys
if "--force-obsolete" not in _sys.argv:
    raise SystemExit(
        "REFUSED: soft_rivets.py is obsolete and would regress player_ship.glb.\n"
        "  It operates on the weather_pass2 rust atlases, which no longer exist in the current clean-paint model.\n"
        "  Rebuild with: build_arleigh_burke.py\n"
        "  Override with --force-obsolete if you really mean it."
    )


import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

import bpy
import numpy as np

from refine_player_ship_materials import (
    ATLASES,
    IN,
    OUT,
    array_to_image,
    image_to_array,
    reset_scene,
    smooth_box,
    snapshot_mount_names,
)

# Fraction of high-frequency rivet detail to remove (keep organic low-freq)
RIVET_SOFTEN = 0.72
# Normal-map high-frequency XY peak reduction (~50% softer)
NORMAL_HF_REDUCE = 0.50


def _radii(h: int, w: int) -> tuple[int, int, int, int]:
    m = min(h, w)
    r_fine = max(1, m // 220)       # rivet/dot scale
    r_soft = max(2, m // 110)       # blur rivet grid
    r_base = max(3, m // 48)        # preserve streaks/grime
    r_norm = max(2, m // 90)        # normal HF separation
    return r_fine, r_soft, r_base, r_norm


def _smooth_rgb(rgb: np.ndarray, radius: int) -> np.ndarray:
    return np.stack([smooth_box(rgb[..., c], radius) for c in range(3)], axis=2)


def rivet_regularity_mask(lum: np.ndarray, r_fine: int, r_soft: int, r_base: int) -> np.ndarray:
    """
    Score 0-1 where dense regular rivet grids dominate.
    Organic streaks/grime are lower-frequency and score lower.
    """
    h, w = lum.shape
    # High-frequency layer (rivets / dot grid)
    hf = lum - smooth_box(lum, r_fine)
    hf_soft = smooth_box(hf, r_soft)

    # Energy that survives small blur but dies on medium blur => periodic dots
    periodic = np.abs(hf - hf_soft)
    periodic = smooth_box(periodic, r_fine)

    # Autocorrelation at rivet spacing — regular grids correlate at fixed lag
    spacing = max(2, min(h, w) // 140)
    sx = np.roll(hf, spacing, axis=1)
    sy = np.roll(hf, spacing, axis=0)
    corr = (
        smooth_box(hf * sx, r_soft)
        + smooth_box(hf * sy, r_soft)
    ) * 0.5
    hf_var = smooth_box(hf * hf, r_soft) + 1e-6
    corr_norm = np.clip(corr / hf_var, 0, 1)

    # Local HF variance — uniform rivet fields stay high
    local_std = np.sqrt(np.maximum(
        smooth_box(hf * hf, r_fine) - smooth_box(hf, r_fine) ** 2,
        0,
    ))

    # Combine signals; normalize per-atlas
    raw = periodic * 0.45 + corr_norm * 0.35 + local_std * 0.20
    lo, hi = np.percentile(raw, [8, 92])
    mask = np.clip((raw - lo) / max(hi - lo, 1e-4), 0, 1)

    # Suppress mask on large-scale organic features (streaks, waterline bands)
    low_freq = smooth_box(lum, r_base)
    organic_grad = np.abs(lum - low_freq)
    organic_grad = smooth_box(organic_grad, r_base)
    og_lo, og_hi = np.percentile(organic_grad, [60, 98])
    organic = np.clip((organic_grad - og_lo) / max(og_hi - og_lo, 1e-4), 0, 1)
    mask *= 1.0 - organic * 0.65

    return np.clip(mask, 0, 1)


def soften_albedo_rivets(col: np.ndarray) -> tuple[np.ndarray, float]:
    """Blur dense rivet grids on RGB; preserve organic weathering."""
    h, w = col.shape[:2]
    r_fine, r_soft, r_base, _ = _radii(h, w)

    rgb = col[..., :3].copy()
    alpha = col[..., 3:4]
    lum = rgb.mean(axis=2)

    mask = rivet_regularity_mask(lum, r_fine, r_soft, r_base)

    # Frequency separation per channel
    base = _smooth_rgb(rgb, r_base)
    hf = rgb - _smooth_rgb(rgb, r_fine)
    hf_soft = _smooth_rgb(hf, r_soft)

    blend = mask[..., None] * RIVET_SOFTEN
    new_rgb = base + hf * (1.0 - blend) + hf_soft * blend

    # Gentle overall luminance pass — kill residual dot tiling
    new_lum = new_rgb.mean(axis=2)
    lum_hf = new_lum - smooth_box(new_lum, r_fine)
    lum_soft = smooth_box(lum_hf, r_soft)
    corrected_lum = new_lum - lum_hf * mask * RIVET_SOFTEN + lum_soft * mask * RIVET_SOFTEN
    scale = corrected_lum / np.maximum(new_lum, 1e-4)
    new_rgb *= scale[..., None]

    mean_mask = float(mask.mean())
    return np.clip(np.concatenate([new_rgb, alpha], axis=2), 0, 1), mean_mask


def soften_normal_rivets(nrm: np.ndarray) -> tuple[np.ndarray, float]:
    """Reduce high-frequency normal peaks (rivet bumps) by ~50%."""
    h, w = nrm.shape[:2]
    _, r_soft, _, r_norm = _radii(h, w)
    alpha = nrm[..., 3:4]

    # Tangent-space decode
    tangent = nrm[..., :3] * 2.0 - 1.0
    nx, ny, nz = tangent[..., 0], tangent[..., 1], tangent[..., 2]

    nx_blur = smooth_box(nx, r_norm)
    ny_blur = smooth_box(ny, r_norm)
    nx_hf = nx - nx_blur
    ny_hf = ny - ny_blur

    keep = 1.0 - NORMAL_HF_REDUCE
    nx_new = nx_blur + nx_hf * keep
    ny_new = ny_blur + ny_hf * keep
    nz_new = np.sqrt(np.clip(1.0 - nx_new ** 2 - ny_new ** 2, 0, 1))

    # Extra pass: soften HF on Z perturbation relative to flat
    nz_flat = np.ones_like(nz)
    nz_hf = nz - smooth_box(nz, r_norm)
    nz_new = nz_flat + nz_hf * keep
    # Re-normalize
    vec = np.stack([nx_new, ny_new, nz_new], axis=2)
    vec /= np.maximum(np.linalg.norm(vec, axis=2, keepdims=True), 1e-4)

    rgb = vec * 0.5 + 0.5
    hf_energy_before = float(np.mean(nx_hf ** 2 + ny_hf ** 2))
    nx_hf_after = vec[..., 0] - smooth_box(vec[..., 0], r_norm)
    ny_hf_after = vec[..., 1] - smooth_box(vec[..., 1], r_norm)
    hf_energy_after = float(np.mean(nx_hf_after ** 2 + ny_hf_after ** 2))
    reduction = 1.0 - (hf_energy_after / max(hf_energy_before, 1e-8))
    return np.clip(np.concatenate([rgb.astype(np.float32), alpha], axis=2), 0, 1), reduction


def main() -> None:
    if not IN.exists():
        raise FileNotFoundError(IN)

    reset_scene()
    bpy.ops.import_scene.gltf(filepath=str(IN))
    before_mounts = snapshot_mount_names()

    processed = []
    for col_name, rgh_name, nrm_name, _is_paint in ATLASES:
        col_img = bpy.data.images.get(col_name)
        nrm_img = bpy.data.images.get(nrm_name)
        if col_img is None:
            print("SKIP missing albedo:", col_name)
            continue

        col = image_to_array(col_img)
        new_col, rivet_cov = soften_albedo_rivets(col)
        array_to_image(col_img, new_col)

        nrm_reduction = 0.0
        if nrm_img is not None:
            nrm = image_to_array(nrm_img)
            new_nrm, nrm_reduction = soften_normal_rivets(nrm)
            array_to_image(nrm_img, new_nrm)
            nrm_img.colorspace_settings.name = "Non-Color"
        else:
            print("WARN no normal:", nrm_name)

        processed.append(col_name)
        print(
            f"SOFT_RIVETS {col_name} / {nrm_name}: "
            f"rivet_mask_mean={rivet_cov:.3f} normal_hf_reduction={nrm_reduction:.1%}"
        )

    for img in bpy.data.images:
        if img.size[0] > 0 and img.pixels:
            img.pack()

    for obj in bpy.data.objects:
        if obj.name.endswith(".001"):
            base = obj.name[:-4]
            if bpy.data.objects.get(base) is None:
                obj.name = base

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
    print("MOUNT POINTS before:", before_mounts or "(none)")
    print("MOUNT POINTS after:", after_mounts or "(none)")
    print("ATLASES SOFTENED:", processed)

    if size_mb >= 40:
        print(f"WARNING: export exceeds 40 MB target ({size_mb:.2f} MB)")


if __name__ == "__main__":
    main()
