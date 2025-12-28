import logging
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
    model: HFSegformer,
    transform: SegformerTransform,
    images: Union[
        np.ndarray,
        Image.Image,
        torch.Tensor,
        List[Union[np.ndarray, Image.Image, torch.Tensor]],
    ],
    return_type: str = "numpy",
    device: Union[str, torch.device] = "cpu",
    colormap: bool = True,
) -> Union[
    np.ndarray,
    Image.Image,
    torch.Tensor,
    List[Union[np.ndarray, Image.Image, torch.Tensor]],
]:
    """
    Run inference on in-memory images and return predictions.

    Args:
        model: Preloaded HFSegformer model.
        transform: Preloaded SegformerTransform for preprocessing.
        images: Single image or list of images (numpy arrays, PIL Images, or torch Tensors).
        return_type: "numpy", "pil", or "tensor" to specify output format.
        device: Device to run inference on ("cpu" or "cuda").
        colormap: Whether to apply color map to output masks.
    Returns:
        Single prediction or list of predictions in specified format.
    Raises:
        InferenceException: If inference fails.
    """

    logger.info("Starting inference (in-memory) process")

    try:
        model = model.to(device)
        model.eval()
        num_classes = getattr(model.config, "num_labels", 150)
        palette = _build_color_palette(num_classes)

    except Exception as e:
        raise TrainingException(
            f"Failed to set up model and transforms: {str(e)}"
        ) from e

    def _to_pil(img: Union[np.ndarray, Image.Image, torch.Tensor]) -> Image.Image:
        if isinstance(img, Image.Image):
            return img.convert("RGB")
        if isinstance(img, np.ndarray):
            arr = img
            if arr.dtype != np.uint8:
                if arr.max() <= 1.0:
                    arr = (arr * 255).astype("uint8")
                else:
                    arr = arr.astype("uint8")
            if arr.ndim == 3 and arr.shape[2] == 3:
                return Image.fromarray(arr).convert("RGB")
            if arr.ndim == 2:
                return Image.fromarray(arr).convert("RGB")
            raise InferenceException("Unsupported numpy array shape for image")
        if isinstance(img, torch.Tensor):
            arr = img.detach().cpu().numpy()
            if arr.ndim == 3 and arr.shape[0] in (1, 3, 4):
                arr = np.transpose(arr, (1, 2, 0))
            if arr.dtype != np.uint8:
                if arr.max() <= 1.0:
                    arr = (arr * 255).astype("uint8")
                else:
                    arr = arr.astype("uint8")
            if arr.ndim == 3 and arr.shape[2] == 3:
                return Image.fromarray(arr).convert("RGB")
            if arr.ndim == 2:
                return Image.fromarray(arr).convert("RGB")
            raise InferenceException("Unsupported tensor shape for image")
        raise InferenceException("Unsupported image type for conversion to PIL")

    single_input = False
    if not isinstance(images, list):
        images = [images]
        single_input = True

    try:
        results: List[Union[np.ndarray, Image.Image, torch.Tensor]] = []

        for img in images:
            pil_img = _to_pil(img)
            input_tensor = transform(images=pil_img).unsqueeze(0).to(device)
            with torch.no_grad():
                logits = model(input_tensor).logits
                preds = torch.argmax(logits, dim=1).squeeze(0)

            if return_type == "tensor":
                if colormap:
                    out_np = preds.detach().cpu().numpy().astype("uint8")
                    colorized_mask = _apply_colormap(out_np, palette)
                    colorized_mask = colorized_mask.resize(
                        pil_img.size, Image.Resampling.NEAREST
                    )
                    arr = np.array(colorized_mask)
                    out = torch.from_numpy(np.transpose(arr, (2, 0, 1))).to(torch.uint8)
                else:
                    out = preds.detach().cpu()
            elif return_type == "pil":
                out_np = preds.detach().cpu().numpy().astype("uint8")
                if colormap:
                    colorized_mask = _apply_colormap(out_np, palette)
                    colorized_mask = colorized_mask.resize(
                        pil_img.size, Image.Resampling.NEAREST
                    )
                    out = colorized_mask
                else:
                    gray = Image.fromarray(out_np, mode="L")
                    gray = gray.resize(pil_img.size, Image.Resampling.NEAREST)
                    out = gray
            else:  # default to numpy
                if colormap:
                    out_np = preds.detach().cpu().numpy().astype("uint8")
                    colorized_mask = _apply_colormap(out_np, palette)
                    colorized_mask = colorized_mask.resize(
                        pil_img.size, Image.Resampling.NEAREST
                    )
                    out = np.array(colorized_mask)
                else:
                    out = preds.detach().cpu().numpy()

            results.append(out)

        return results[0] if single_input else results

    except Exception as e:
        raise InferenceException(f"Inference failed: {str(e)}") from e
