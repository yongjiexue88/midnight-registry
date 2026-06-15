from pathlib import Path

from PIL import Image, ImageStat


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "scripts/source-assets/midnight-monsters"
OUTPUT_DIR = ROOT / "public/assets/midnight-registry/monsters"
MONSTERS = (
    "failed_mimic",
    "parasite_bloom",
    "structure_breaker",
    "hollow_echo",
    "adaptive_collector",
    "frontdesk_replacement",
)
STAGES = ("disguise", "micro_error", "confirmed", "reveal", "threat")
TARGET_SIZE = (512, 768)


def background_color(image: Image.Image) -> tuple[int, int, int]:
    sample = Image.new("RGB", (8, 8))
    corners = (
        image.crop((0, 0, 8, 8)),
        image.crop((image.width - 8, 0, image.width, 8)),
        image.crop((0, image.height - 8, 8, image.height)),
        image.crop((image.width - 8, image.height - 8, image.width, image.height)),
    )
    for index, corner in enumerate(corners):
        sample.paste(corner.resize((4, 4)), ((index % 2) * 4, (index // 2) * 4))
    return tuple(round(value) for value in ImageStat.Stat(sample).median)


def normalize_panel(panel: Image.Image, fill: tuple[int, int, int]) -> Image.Image:
    scale = min(TARGET_SIZE[0] / panel.width, TARGET_SIZE[1] / panel.height)
    resized = panel.resize(
        (round(panel.width * scale), round(panel.height * scale)),
        Image.Resampling.LANCZOS,
    )
    output = Image.new("RGB", TARGET_SIZE, fill)
    output.paste(
        resized,
        ((TARGET_SIZE[0] - resized.width) // 2, (TARGET_SIZE[1] - resized.height) // 2),
    )
    return output


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    panels: dict[tuple[str, str], Image.Image] = {}

    for monster in MONSTERS:
        source_path = SOURCE_DIR / f"{monster}.png"
        if not source_path.exists():
            raise FileNotFoundError(f"Missing monster source strip: {source_path}")

        source = Image.open(source_path).convert("RGB")
        fill = background_color(source)

        for stale_path in OUTPUT_DIR.glob(f"{monster}_*.png"):
            stale_path.unlink()

        for index, stage in enumerate(STAGES):
            left = round(index * source.width / len(STAGES))
            right = round((index + 1) * source.width / len(STAGES))
            panel = normalize_panel(source.crop((left, 0, right, source.height)), fill)
            output_path = OUTPUT_DIR / f"{monster}_{stage}.png"
            panel.save(output_path, optimize=True)
            panels[(monster, stage)] = panel

    sheet = Image.new(
        "RGB",
        (TARGET_SIZE[0] * len(STAGES), TARGET_SIZE[1] * len(MONSTERS)),
        (7, 9, 12),
    )
    for row, monster in enumerate(MONSTERS):
        for column, stage in enumerate(STAGES):
            sheet.paste(
                panels[(monster, stage)],
                (column * TARGET_SIZE[0], row * TARGET_SIZE[1]),
            )

    sheet.save(OUTPUT_DIR / "monster-reveal-contact-sheet.png", optimize=True)
    print(
        f"Generated {len(MONSTERS) * len(STAGES)} five-stage monster portraits "
        f"and contact sheet in {OUTPUT_DIR}."
    )


if __name__ == "__main__":
    main()
