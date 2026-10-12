"""Shrink oversized images in place (same file name and format, so no
references change). Portraits under team/ and alumni/ are capped at 800 px,
everything else at 2000 px; JPEGs are re-encoded at quality 82 and PNGs are
re-saved optimised. Files already within limits and under 300 KB are skipped.

Usage (from the repo root):  python tools/optimize-images.py
Needs: pip install pillow
"""
import pathlib

from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parent.parent
SKIP = {"_site", ".quarto", "_freeze", ".git", "_extensions"}
EXTS = {".jpg", ".jpeg", ".png"}


def limit_for(path: pathlib.Path) -> int:
    return 800 if path.parts[0] in ("team", "alumni") else 2000


def main() -> None:
    before = after = 0
    for p in sorted(ROOT.rglob("*")):
        rel = p.relative_to(ROOT)
        if SKIP.intersection(rel.parts) or p.suffix.lower() not in EXTS or not p.is_file():
            continue
        size = p.stat().st_size
        im = Image.open(p)
        limit = limit_for(rel)
        if max(im.size) <= limit and size < 300_000:
            continue
        im = ImageOps.exif_transpose(im)
        im.thumbnail((limit, limit), Image.LANCZOS)
        if p.suffix.lower() == ".png":
            im.save(p, optimize=True)
        else:
            im.convert("RGB").save(p, quality=82, optimize=True, progressive=True)
        new = p.stat().st_size
        if new >= size:  # never make a file bigger
            continue
        before += size
        after += new
        print(f"{size // 1024:>6} KB -> {new // 1024:>5} KB  {rel}")
    print(f"total {before // 1024} KB -> {after // 1024} KB")


if __name__ == "__main__":
    main()
