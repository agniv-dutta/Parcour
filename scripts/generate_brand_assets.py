from __future__ import annotations

from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFont

NAVY = "#0D1B2A"
GOLD = "#C9A96E"
WHITE = "#FFFFFF"

ROOT = Path(__file__).resolve().parents[1]
BRAND_DIR = ROOT / "frontend" / "public" / "brand"
FAVICON_DIR = ROOT / "frontend" / "public" / "favicon"


def ensure_dirs() -> None:
    BRAND_DIR.mkdir(parents=True, exist_ok=True)
    FAVICON_DIR.mkdir(parents=True, exist_ok=True)


def resolve_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        Path("C:/Windows/Fonts/PlayfairDisplay-Regular.ttf"),
        Path("C:/Windows/Fonts/timesbd.ttf"),
        Path("C:/Windows/Fonts/georgiab.ttf"),
        Path("C:/Windows/Fonts/times.ttf"),
        Path("C:/Windows/Fonts/georgia.ttf"),
    ]
    for font_path in candidates:
        if font_path.exists():
            return ImageFont.truetype(str(font_path), size=size)
    return ImageFont.load_default()


def draw_monogram_png(size: int, circle_color: str, letter_color: str, path: Path) -> None:
    # Draw at 4x and downsample for cleaner edges.
    scale = 4
    hi_size = size * scale
    img = Image.new("RGBA", (hi_size, hi_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    border_w = int(hi_size * 0.012)
    inset = int(border_w / 2) + int(hi_size * 0.006)
    draw.ellipse(
        (inset, inset, hi_size - inset, hi_size - inset),
        fill=circle_color,
        outline=GOLD if circle_color == NAVY else WHITE,
        width=border_w,
    )

    font = resolve_font(int(hi_size * 0.58))
    letter = "P"
    bbox = draw.textbbox((0, 0), letter, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]

    # Optical centering: move slightly upward due to serif descender weight.
    x = (hi_size - tw) / 2 - bbox[0]
    y = (hi_size - th) / 2 - bbox[1] - (hi_size * 0.03)
    draw.text((x, y), letter, fill=letter_color, font=font)

    out = img.resize((size, size), Image.Resampling.LANCZOS)
    out.save(path)


def build_svg(circle_color: str, letter_color: str, border_color: str) -> str:
    return f"""<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1024\" height=\"1024\" viewBox=\"0 0 1024 1024\" role=\"img\" aria-label=\"Parcour monogram\">\n  <circle cx=\"512\" cy=\"512\" r=\"498\" fill=\"{circle_color}\" stroke=\"{border_color}\" stroke-width=\"12\" />\n  <text x=\"512\" y=\"500\" text-anchor=\"middle\" dominant-baseline=\"middle\" fill=\"{letter_color}\" font-family=\"'Playfair Display', 'Times New Roman', serif\" font-size=\"470\" font-weight=\"700\">P</text>\n</svg>\n"""


def write_svg(path: Path, circle_color: str, letter_color: str, border_color: str) -> None:
    path.write_text(build_svg(circle_color, letter_color, border_color), encoding="utf-8")


def make_png_set(prefix: str, circle_color: str, letter_color: str) -> None:
    for size in (48, 96, 192):
        draw_monogram_png(size, circle_color, letter_color, BRAND_DIR / f"{prefix}-{size}.png")


def make_favicon_package() -> None:
    icon_32 = FAVICON_DIR / "favicon-32x32.png"
    icon_16 = FAVICON_DIR / "favicon-16x16.png"
    draw_monogram_png(32, NAVY, GOLD, icon_32)
    draw_monogram_png(16, NAVY, GOLD, icon_16)

    ico_src = Image.open(icon_32).convert("RGBA")
    ico_src.save(FAVICON_DIR / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])

    # Apple touch icon with larger padding.
    draw_monogram_png(180, NAVY, GOLD, FAVICON_DIR / "apple-touch-icon.png")


def make_og_image() -> None:
    w, h = 1200, 630
    img = Image.new("RGB", (w, h), NAVY)
    draw = ImageDraw.Draw(img)

    # Subtle panel for depth.
    panel_color = (22, 32, 50)
    draw.rounded_rectangle((40, 40, w - 40, h - 40), radius=28, fill=panel_color)

    # Monogram block.
    mono_size = 210
    mono_path = BRAND_DIR / "_tmp-og-mono.png"
    draw_monogram_png(mono_size, NAVY, GOLD, mono_path)
    mono = Image.open(mono_path).convert("RGBA")
    img.paste(mono, (90, (h - mono_size) // 2), mono)
    mono_path.unlink(missing_ok=True)

    title_font = resolve_font(92)
    subtitle_font = resolve_font(46)

    draw.text((350, 225), "Parcour", font=title_font, fill=GOLD)
    draw.text((352, 330), "Luxury Concierge", font=subtitle_font, fill=WHITE)

    img.save(FAVICON_DIR / "og-image.png")


def main() -> None:
    ensure_dirs()

    write_svg(BRAND_DIR / "parcour-monogram-navy-gold.svg", NAVY, GOLD, GOLD)
    write_svg(BRAND_DIR / "parcour-monogram-gold-white.svg", GOLD, WHITE, WHITE)

    make_png_set("parcour-monogram-navy-gold", NAVY, GOLD)
    make_png_set("parcour-monogram-gold-white", GOLD, WHITE)

    make_favicon_package()
    make_og_image()

    print("Brand assets generated:")
    for p in sorted(BRAND_DIR.glob("*")):
        print(f" - {p.relative_to(ROOT)}")
    for p in sorted(FAVICON_DIR.glob("*")):
        print(f" - {p.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
