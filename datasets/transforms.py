from typing import Union
import numpy as np
import torch
from transformers import SegformerImageProcessor
from PIL import Image


class SegformerTransform:
    r"""
    Transform class to preprocess images and masks for Segformer model.
    Uses SegformerImageProcessor for image preprocessing and resizes masks accordingly.
    Args:
        image_processor (SegformerImageProcessor): Pretrained Segformer image processor.
    Returns:
        A tuple of (preprocessed_image_tensor, resized_mask_tensor).
    """

    def __init__(self, image_processor: SegformerImageProcessor):
        self.image_processor = image_processor

    def __call__(
        self, images: Union[Image.Image, np.ndarray], masks: Union[Image.Image, np.ndarray]
    ) -> tuple[torch.Tensor, torch.Tensor]:
        if isinstance(images, Image.Image):
            images = np.array(images)
        if isinstance(masks, Image.Image):
            masks = np.array(masks)

        encoding = self.image_processor(images=images, return_tensors="pt")
        pixel_values = encoding.pixel_values.squeeze()  # Remove batch dimension

        # Convert mask to tensor
        mask_tensor = torch.as_tensor(masks, dtype=torch.long)
        mask_tensor = self.resize_mask(
            mask_tensor, size=pixel_values.shape[-2:]
        )  # Resize mask to match image size

        return pixel_values, mask_tensor

    def resize_mask(self, mask: torch.Tensor, size: tuple) -> torch.Tensor:
        return (
            torch.nn.functional.interpolate(
                mask.unsqueeze(0).unsqueeze(0).float(), size=size, mode="nearest"
            )
            .squeeze(0)
            .squeeze(0)
            .long()
        )

    def __repr__(self):
        return f"{self.__class__.__name__}(image_processor={self.image_processor})"
