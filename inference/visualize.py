from PIL import Image
import numpy as np

def _build_color_palette(num_classes: int) -> list[int]:
    """Generate a deterministic RGB palette for up to 256 classes."""
    palette = [0] * (num_classes * 3)
    for label in range(num_classes):
        lab = label
        r = g = b = 0
        i = 0
        while lab:
            r |= ((lab >> 0) & 1) << (7 - i)
            g |= ((lab >> 1) & 1) << (7 - i)
            b |= ((lab >> 2) & 1) << (7 - i)
            lab >>= 3
            i += 1
        palette[label * 3 : label * 3 + 3] = [r, g, b]
    return palette


def _apply_colormap(mask: np.ndarray, palette: list[int]) -> Image.Image:
    color_mask = Image.fromarray(mask.astype("uint8"), mode="P")
    color_mask.putpalette(palette)
    return color_mask.convert("RGB")