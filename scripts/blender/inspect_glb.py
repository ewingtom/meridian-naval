"""Quick GLB inspector — sizes, image budget, and the WORLD-SPACE bounding box in
glTF coordinates (which is what the three.js runtime actually sees).

Used to verify the axis convention documented in src/entities/EnemyShip.js:64
(bow = +Z, up = +Y, beam = X, centred on X=0) without having to eyeball the model
in-game first.

  python3 scripts/blender/inspect_glb.py public/assets/models/merchant_ship.glb
"""
from __future__ import annotations

import json
import struct
import sys
from pathlib import Path


def load_glb(path: Path):
    data = path.read_bytes()
    magic, version, length = struct.unpack_from("<III", data, 0)
    assert magic == 0x46546C67, "not a GLB"
    off = 12
    js, bin_chunk = None, None
    while off < length:
        clen, ctype = struct.unpack_from("<II", data, off)
        chunk = data[off + 8: off + 8 + clen]
        if ctype == 0x4E4F534A:
            js = json.loads(chunk.decode("utf-8"))
        elif ctype == 0x004E4942:
            bin_chunk = chunk
        off += 8 + clen + ((4 - clen % 4) % 4 if clen % 4 else 0)
    return js, bin_chunk, len(data)


def mat_mul(a, b):
    out = [0.0] * 16
    for c in range(4):
        for r in range(4):
            out[c * 4 + r] = sum(a[k * 4 + r] * b[c * 4 + k] for k in range(4))
    return out


def trs_matrix(node):
    if "matrix" in node:
        return list(node["matrix"])
    t = node.get("translation", [0, 0, 0])
    r = node.get("rotation", [0, 0, 0, 1])
    s = node.get("scale", [1, 1, 1])
    x, y, z, w = r
    rot = [
        1 - 2 * (y * y + z * z), 2 * (x * y + z * w), 2 * (x * z - y * w), 0,
        2 * (x * y - z * w), 1 - 2 * (x * x + z * z), 2 * (y * z + x * w), 0,
        2 * (x * z + y * w), 2 * (y * z - x * w), 1 - 2 * (x * x + y * y), 0,
        0, 0, 0, 1,
    ]
    for c in range(3):
        for r_ in range(3):
            rot[c * 4 + r_] *= s[c]
    rot[12], rot[13], rot[14] = t
    return rot


def xform(m, p):
    x, y, z = p
    return (
        m[0] * x + m[4] * y + m[8] * z + m[12],
        m[1] * x + m[5] * y + m[9] * z + m[13],
        m[2] * x + m[6] * y + m[10] * z + m[14],
    )


def main(path):
    p = Path(path)
    js, binc, total = load_glb(p)
    img_bytes = 0
    for i, img in enumerate(js.get("images", [])):
        bv = js["bufferViews"][img["bufferView"]]
        img_bytes += bv["byteLength"]
        print(f"  image[{i}] {img.get('name','?'):<16} {img.get('mimeType','?'):<12} "
              f"{bv['byteLength']/1024:8.1f} KB")
    print(f"TOTAL {total/1024/1024:.2f} MB   images {img_bytes/1024/1024:.2f} MB   "
          f"geometry+json {(total-img_bytes)/1024/1024:.2f} MB")

    accs = js["accessors"]
    lo = [1e30] * 3
    hi = [-1e30] * 3
    named = {}

    def walk(ni, parent):
        node = js["nodes"][ni]
        m = mat_mul(parent, trs_matrix(node))
        if "mesh" in node:
            for prim in js["meshes"][node["mesh"]]["primitives"]:
                a = accs[prim["attributes"]["POSITION"]]
                for corner in range(8):
                    pt = [a["max" if corner >> k & 1 else "min"][k] for k in range(3)]
                    w = xform(m, pt)
                    for k in range(3):
                        lo[k] = min(lo[k], w[k])
                        hi[k] = max(hi[k], w[k])
        if "name" in node and "mesh" not in node:
            named[node["name"]] = (round(m[12], 2), round(m[13], 2), round(m[14], 2))
        for c in node.get("children", []):
            walk(c, m)

    ident = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    for ni in js["scenes"][js.get("scene", 0)]["nodes"]:
        walk(ni, ident)
    print(f"BBOX  X {lo[0]:8.2f} .. {hi[0]:8.2f}   (beam  {hi[0]-lo[0]:7.2f})")
    print(f"      Y {lo[1]:8.2f} .. {hi[1]:8.2f}   (height{hi[1]-lo[1]:7.2f})")
    print(f"      Z {lo[2]:8.2f} .. {hi[2]:8.2f}   (length{hi[2]-lo[2]:7.2f})")
    if named:
        print("EMPTIES:", named)
    tris = 0
    for mesh in js.get("meshes", []):
        for prim in mesh["primitives"]:
            if "indices" in prim:
                tris += accs[prim["indices"]]["count"] // 3
    print(f"MESHES {len(js.get('meshes', []))}  MATERIALS {len(js.get('materials', []))}  TRIS {tris}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "public/assets/models/merchant_ship.glb")
