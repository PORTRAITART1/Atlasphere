"""Build Atlasphere store assets (INTRO 400x400 and PREVIEW 750x1500).

Every generated background is text-free. This script composes the official
Atlasphere logo together with the "Atlasphere" wordmark, so the brand name is
never displayed without the real logo next to it.

Usage:
    python3 scripts/build_store_assets.py
"""

import io
import os
import urllib.request

from PIL import Image, ImageDraw, ImageFont

BASE_URL = "https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-08-30/"

LOGO_PATH = "public/assets/logo-atlasphere-transparent.png"
OUT_DIR = "public/marketing-pack/store-assets"

# Brand colors (gold gradient endpoints used across the app).
GOLD = (251, 191, 36)
WHITE = (255, 255, 255)
SUBTITLE = (203, 213, 225)

FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
]

# (remote path, output name, target size, headline, subtitle)
ITEMS = [
    (
        "vpguuxacakkq/base-square-governance-globe-clean.png",
        "intro-01-governance-globe",
        (400, 400),
        None,
        None,
    ),
    (
        "vpguvsacakka/base-square-project-funding-clean.png",
        "intro-02-project-funding",
        (400, 400),
        None,
        None,
    ),
    (
        "vpguv6ycakjq/base-square-ecochain-clean.png",
        "intro-03-ecochain-climate",
        (400, 400),
        None,
        None,
    ),
    (
        "vpguwlycakma/base-square-quadratic-voting-clean.png",
        "intro-04-quadratic-voting",
        (400, 400),
        None,
        None,
    ),
    (
        "vpguwyqcaklq/base-square-treasury-clean.png",
        "intro-05-treasury-badges",
        (400, 400),
        None,
        None,
    ),
    (
        "vpguxhiaakla/base-vertical-governance-hero-clean.png",
        "preview-01-governance-hero",
        (750, 1500),
        "ATLASPHERE",
        "DECENTRALIZED GOVERNANCE ON PI",
    ),
    (
        "vpguxuacakkq/base-vertical-project-funding-clean.png",
        "preview-02-project-funding",
        (750, 1500),
        "ATLASPHERE",
        "FUND REAL COMMUNITY PROJECTS",
    ),
    (
        "vpguybaaakka/base-vertical-ecochain-clean.png",
        "preview-03-ecochain-climate",
        (750, 1500),
        "ATLASPHERE",
        "ECOCHAIN CLIMATE DATA",
    ),
    (
        "vpguynycakjq/base-vertical-voting-clean.png",
        "preview-04-quadratic-voting",
        (750, 1500),
        "ATLASPHERE",
        "VOTE WITH YOUR REPUTATION",
    ),
    (
        "vpguy2qcaklq/base-vertical-treasury-clean.png",
        "preview-05-treasury",
        (750, 1500),
        "ATLASPHERE",
        "TRANSPARENT DAO TREASURY",
    ),
]


def load_font(size: int) -> ImageFont.FreeTypeFont:
    """Return the first available bold sans-serif font at the given size."""
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def load_logo() -> Image.Image:
    """Load the official logo and tint it with the Atlasphere gold color."""
    logo = Image.open(LOGO_PATH).convert("RGBA")
    alpha = logo.split()[-1]
    tinted = Image.new("RGBA", logo.size, GOLD + (255,))
    tinted.putalpha(alpha)
    return tinted.crop(tinted.getbbox())


def cover_resize(image: Image.Image, target: tuple[int, int]) -> Image.Image:
    """Scale and center-crop the image so it exactly fills the target size."""
    tw, th = target
    sw, sh = image.size
    scale = max(tw / sw, th / sh)
    resized = image.resize(
        (max(tw, round(sw * scale)), max(th, round(sh * scale))), Image.LANCZOS
    )
    nw, nh = resized.size
    left, top = (nw - tw) // 2, (nh - th) // 2
    return resized.crop((left, top, left + tw, top + th))


def draw_scrim(canvas: Image.Image, box: tuple[int, int, int, int], opacity: int) -> None:
    """Darken a rectangular band so the overlaid brand lockup stays readable."""
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(overlay).rectangle(box, fill=(6, 10, 28, opacity))
    canvas.alpha_composite(overlay)


def compose_intro(base: Image.Image, logo: Image.Image, size: tuple[int, int]) -> Image.Image:
    """400x400 icon: logo plus the Atlasphere wordmark on a bottom scrim."""
    canvas = cover_resize(base, size).convert("RGBA")
    width, height = canvas.size

    band_top = int(height * 0.70)
    draw_scrim(canvas, (0, band_top, width, height), 165)

    logo_size = int(height * 0.17)
    mark = logo.resize((logo_size, logo_size), Image.LANCZOS)

    font = load_font(int(height * 0.115))
    text = "Atlasphere"
    draw = ImageDraw.Draw(canvas)
    tw = draw.textbbox((0, 0), text, font=font)[2]

    gap = int(logo_size * 0.22)
    total = logo_size + gap + tw
    start_x = (width - total) // 2
    center_y = band_top + (height - band_top) // 2

    canvas.alpha_composite(mark, (start_x, center_y - logo_size // 2))
    draw.text(
        (start_x + logo_size + gap, center_y),
        text,
        font=font,
        fill=GOLD,
        anchor="lm",
    )
    return canvas


def compose_preview(
    base: Image.Image,
    logo: Image.Image,
    size: tuple[int, int],
    headline: str,
    subtitle: str,
) -> Image.Image:
    """750x1500 store preview: logo lockup, headline and feature subtitle."""
    canvas = cover_resize(base, size).convert("RGBA")
    width, height = canvas.size
    draw = ImageDraw.Draw(canvas)

    band_bottom = int(height * 0.255)
    draw_scrim(canvas, (0, 0, width, band_bottom), 150)

    logo_size = int(width * 0.20)
    mark = logo.resize((logo_size, logo_size), Image.LANCZOS)
    logo_y = int(height * 0.030)
    canvas.alpha_composite(mark, ((width - logo_size) // 2, logo_y))

    title_font = load_font(int(width * 0.088))
    sub_font = load_font(int(width * 0.032))

    title_y = logo_y + logo_size + int(height * 0.012)
    draw.text((width // 2, title_y), headline, font=title_font, fill=GOLD, anchor="ma")

    title_h = draw.textbbox((0, 0), headline, font=title_font)[3]
    rule_y = title_y + title_h + int(height * 0.012)
    draw.line(
        [(width * 0.30, rule_y), (width * 0.70, rule_y)],
        fill=WHITE + (150,),
        width=max(2, int(height * 0.0015)),
    )

    draw.text(
        (width // 2, rule_y + int(height * 0.014)),
        subtitle,
        font=sub_font,
        fill=SUBTITLE,
        anchor="ma",
    )
    return canvas


def save_under_limit(image: Image.Image, path: str, limit: int = 1024 * 1024) -> int:
    """Save the PNG, falling back to a 256-color palette if it exceeds the limit."""
    rgb = image.convert("RGB")
    rgb.save(path, "PNG", optimize=True)
    if os.path.getsize(path) > limit:
        rgb.convert("P", palette=Image.ADAPTIVE, colors=256).save(
            path, "PNG", optimize=True
        )
    return os.path.getsize(path)


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    logo = load_logo()

    for remote, name, size, headline, subtitle in ITEMS:
        raw = urllib.request.urlopen(BASE_URL + remote, timeout=180).read()
        base = Image.open(io.BytesIO(raw)).convert("RGB")

        if headline:
            composed = compose_preview(base, logo, size, headline, subtitle)
        else:
            composed = compose_intro(base, logo, size)

        dst = os.path.join(OUT_DIR, f"{name}.png")
        written = save_under_limit(composed, dst)
        print(f"{name}: {composed.size} {round(written / 1024, 1)} KB")


if __name__ == "__main__":
    main()