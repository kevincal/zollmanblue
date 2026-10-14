"""Turn scanned furniture plates into navy line art on a transparent background.

usage: python3 -I scripts/process-drawings.py RAW_DIR public/drawings
RAW_DIR holds the downloaded scans named 1.img … 9.img in the order of PLATES (sources in README).
Paper tone is flattened (divide by a line-free background estimate), then ink darkness is
pushed through a steep curve for very high contrast and used as the alpha channel.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

NAVY = (10, 39, 73)
MAX_SIDE = 1000  # longest side; detail beyond this is invisible at onion-skin opacity

# name, crop box as fractions (left, top, right, bottom) to drop captions/plate edges
PLATES = {
    1: ("chippendale-chairs-xiv", (0.04, 0.06, 0.96, 0.90)),
    2: ("ribband-back-chairs", (0.03, 0.13, 0.97, 0.84)),
    3: ("hepplewhite-designs", (0.0, 0.0, 1.0, 0.90)),
    4: ("french-commode", (0.0, 0.0, 1.0, 0.86)),
    5: ("sheraton-sofa-table", (0.0, 0.0, 1.0, 0.86)),
    6: ("sheraton-chair-backs", (0.18, 0.10, 0.92, 0.94)),
    7: ("director-construction", (0.0, 0.0, 1.0, 1.0)),
    8: ("director-chair", (0.0, 0.0, 1.0, 1.0)),
    9: ("darly-three-chairs", (0.0, 0.05, 0.97, 0.88)),
}


def process(src: Path, crop):
    im = Image.open(src).convert("L")
    w, h = im.size
    im = im.crop((int(crop[0] * w), int(crop[1] * h), int(crop[2] * w), int(crop[3] * h)))
    scale = MAX_SIDE / max(im.size)
    if scale < 1:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)

    # Background estimate: grow light areas over the thin lines, then smooth.
    bg = im.filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.GaussianBlur(18))
    a = np.asarray(im, dtype=np.float32)
    b = np.maximum(np.asarray(bg, dtype=np.float32), 1)
    ink = 1 - np.clip(a / b, 0, 1)  # 0 = paper, 1 = darkest ink

    # Steep contrast curve: faint paper texture -> fully clear, real lines -> solid.
    alpha = np.clip((ink - 0.16) / 0.30, 0, 1) ** 0.85

    out = np.zeros((*alpha.shape, 4), dtype=np.uint8)
    out[..., :3] = NAVY
    out[..., 3] = (alpha * 255).astype(np.uint8)
    img = Image.fromarray(out, "RGBA")

    # Trim to the drawing with a little breathing room.
    box = Image.fromarray((alpha > 0.15).astype(np.uint8) * 255).getbbox()
    if box:
        pad = 12
        img = img.crop((max(box[0] - pad, 0), max(box[1] - pad, 0),
                        min(box[2] + pad, img.width), min(box[3] + pad, img.height)))
    return img


def main(raw_dir: str, out_dir: str):
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    for n, (name, crop) in PLATES.items():
        img = process(Path(raw_dir) / f"{n}.img", crop)
        dest = out / f"{n:02d}-{name}.webp"
        img.save(dest, "WEBP", quality=72, method=6)
        print(f"{dest.name}\t{img.width}x{img.height}\t{dest.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main(*sys.argv[1:3])
