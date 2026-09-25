from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1] / "assets" / "images"


def optimize_png(name: str, max_size: tuple[int, int], colors: int) -> None:
    path = ROOT / name
    with Image.open(path) as source:
        image = source.convert("RGB")
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        palette_image = image.quantize(
            colors=colors,
            method=Image.Quantize.MEDIANCUT,
            dither=Image.Dither.FLOYDSTEINBERG,
        )
        palette_image.save(path, format="PNG", optimize=True, compress_level=9)


for icon_name, icon_size in (
    ("icon.png", (1024, 1024)),
    ("android-icon-foreground.png", (1024, 1024)),
    ("splash-icon.png", (1024, 1024)),
    ("favicon.png", (512, 512)),
):
    optimize_png(icon_name, icon_size, colors=32)

# Historical asset retained for project continuity even though the current
# monochrome home screen no longer renders it.
optimize_png("forest-background.png", (1376, 768), colors=64)
