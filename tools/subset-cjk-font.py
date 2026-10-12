"""Rebuild assets/fonts/NotoSerifSC-600-site.woff2 (Chinese heading font).

The font is subset to the Chinese characters used anywhere in the site source,
so it stays small (~80 KB). Run this after adding Chinese text to headings or
names; characters missing from the subset fall back to the system serif.

Needs: pip install fonttools brotli
Source font (not committed, ~25 MB), from the Google Fonts repository:
  https://github.com/google/fonts/raw/main/ofl/notoserifsc/NotoSerifSC%5Bwght%5D.ttf

Usage (from the repo root):
  python tools/subset-cjk-font.py path/to/NotoSerifSC[wght].ttf
"""
import pathlib
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

SKIP = {"_site", ".quarto", "_freeze", ".git", "node_modules"}
SUFFIXES = {".qmd", ".md", ".markdown", ".yml", ".yaml", ".html", ".ejs"}


def site_chars(root: pathlib.Path) -> str:
    chars = set()
    for p in root.rglob("*"):
        if SKIP.intersection(p.parts) or p.suffix not in SUFFIXES or not p.is_file():
            continue
        for c in p.read_text(errors="ignore"):
            if "　" <= c <= "鿿" or "＀" <= c <= "￯" or c in "“”‘’·—…":
                chars.add(c)
    return "".join(sorted(chars))


def main(src: str) -> None:
    root = pathlib.Path(__file__).resolve().parent.parent
    text = site_chars(root)
    font = instancer.instantiateVariableFont(TTFont(src), {"wght": 600})
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]
    sub = subset.Subsetter(opts)
    sub.populate(text=text)
    sub.subset(font)
    out = root / "assets/fonts/NotoSerifSC-600-site.woff2"
    font.flavor = "woff2"
    font.save(out)
    print(f"{len(text)} characters -> {out} ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main(sys.argv[1])
