import logging
import os
from typing import List, Union

import numpy as np
import torch
from PIL import Image

from datasets.transforms import SegformerTransform
from exceptions import InferenceException, TrainingException
from models import HFSegformer

logger = logging.getLogger(__name__)


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


def _apply_colormap(mask: "np.ndarray", palette: list[int]) -> Image.Image:
    color_mask = Image.fromarray(mask.astype("uint8"), mode="P")
    color_mask.putpalette(palette)
    return color_mask.convert("RGB")


def run_inference(
    cfg, image_paths: Union[List[str], List[os.PathLike], str, os.PathLike]
) -> None:
    logger.info("Starting inference process")

    try:
        transform = SegformerTransform.from_pretrained(
            cfg.models.segformer.variant.b0.huggingface_name
        )

        segformer_model = HFSegformer.from_pretrained(
            cfg.models.segformer.variant.b0.huggingface_name
        )
        num_classes = getattr(segformer_model.config, "num_labels", 150)
        palette = _build_color_palette(num_classes)

    except Exception as e:
        raise TrainingException(
            f"Failed to set up model and transforms: {str(e)}"
        ) from e

    logger.info("Model and transforms set up successfully")

    try:
        inference_results_path = cfg.paths.get("inference_results", "inference_results")
        os.makedirs(inference_results_path, exist_ok=True)
        outputs: List[tuple[Image.Image, str]] = []

        for image_path in image_paths:
            logger.info(f"Processing image: {image_path}")
            image = Image.open(image_path).convert("RGB")
            input = transform(images=image).unsqueeze(0)  # Add batch dimension
            with torch.no_grad():
                output = torch.argmax(segformer_model(input).logits, dim=1)
            output_np = output.squeeze().detach().cpu().numpy()
            colorized_mask = _apply_colormap(output_np, palette)
            colorized_mask = colorized_mask.resize(image.size, Image.Resampling.NEAREST)
            outputs.append((colorized_mask, image_path))

        for colorized_mask, image_path in outputs:
            base_name = os.path.basename(image_path)
            name, _ = os.path.splitext(base_name)
            save_path = os.path.join(inference_results_path, f"infer_{name}.png")
            colorized_mask.save(save_path)
            logger.info(f"Saved segmentation mask to: {save_path}")

    except Exception as e:
        raise InferenceException(f"Inference failed: {str(e)}") from e

    logger.info("Inference completed successfully")
