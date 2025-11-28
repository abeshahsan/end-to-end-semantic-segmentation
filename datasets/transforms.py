from typing import Optional, Union

import numpy as np
import torch
from PIL import Image
from transformers import SegformerImageProcessor

from exceptions import DataTransformException


class SegformerTransform(SegformerImageProcessor):
    def __init__(self, **kwargs):
        try:
            super().__init__(**kwargs)
        except Exception as e:
            raise DataTransformException(f"Initialization failed: {str(e)}") from e

    def __call__(
        self,
        images: Union[Image.Image, np.ndarray],
        masks: Optional[Union[Image.Image, np.ndarray]] = None,
    ) -> tuple[torch.Tensor, torch.Tensor] | torch.Tensor:
        r"""
        Args:
            images (Union[Image.Image, np.ndarray]): Input image or batch of images.
            masks (Optional[Union[Image.Image, np.ndarray]]): Corresponding mask or batch of masks.
        Returns:
            Tuple[torch.Tensor, torch.Tensor] | torch.Tensor: Processed pixel values and masks
        """
        try:
            if isinstance(images, Image.Image):
                images = np.array(images)
            if masks is not None and isinstance(masks, Image.Image):
                masks = np.array(masks)

            encoding = super().__call__(images=images)
            pixel_values = encoding.pixel_values.squeeze()  # Remove batch dimension

            if masks is not None:
                mask_tensor = torch.as_tensor(masks, dtype=torch.long)
                mask_tensor = self.resize_mask(
                    mask_tensor, size=pixel_values.shape[-2:]
                )  # Resize mask to match image size
                return pixel_values, mask_tensor
            return pixel_values
        except Exception as e:
            raise DataTransformException(f"Data transformation failed: {str(e)}") from e

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
