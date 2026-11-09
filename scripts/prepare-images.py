"""Prepare website images without changing the owner's original media.

Optional maintenance command: python scripts/prepare-images.py
Requires Pillow. The normal npm build uses the prepared files in public/images.
"""

import json
import shutil
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
FOLDERS = ("standart", "duluxe", "private", "big_room", "pool", "hall", "dining_room", "villa_yard")


def main():
    # Validate before writing so a checkout without the originals stays intact.
    for folder in FOLDERS:
        if not (ROOT / folder).is_dir():
            raise SystemExit(f"Original photo folder is missing: {folder}")
    destination = ROOT / "public" / "images"
    destination.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for folder in FOLDERS:
        entries = []
        for index, path in enumerate(sorted((ROOT / folder).iterdir())):
            if path.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
                continue
            name = f"{folder}-{index + 1:02d}"
            with Image.open(path) as source:
                image = ImageOps.exif_transpose(source).convert("RGB")
                image.thumbnail((1800, 1350))
                image.save(destination / f"{name}.webp", "WEBP", quality=82, method=6)
                thumbnail = image.copy()
                thumbnail.thumbnail((720, 540))
                thumbnail.save(destination / f"{name}-sm.webp", "WEBP", quality=78, method=6)
            entries.append({"src": f"/images/{name}.webp", "thumb": f"/images/{name}-sm.webp", "original": path.name})
        manifest[folder] = entries
    (ROOT / "src" / "image-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    flyer = ROOT / "Villa Flyer.pdf"
    if flyer.is_file():
        shutil.copyfile(flyer, ROOT / "public" / "villa-bukit-bunga-flyer.pdf")
    print(f"Prepared {sum(len(entries) for entries in manifest.values())} photos.")
    print("If photos were added or renamed, check the coverIndex values in src/data.js.")


if __name__ == "__main__":
    main()
