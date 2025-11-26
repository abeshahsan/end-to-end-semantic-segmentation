import os
from typing import Union
from PIL import Image
import numpy as np
from torch.utils.data import Dataset
import torchvision.transforms as T
import torchvision.transforms.functional as TF

from datasets.transforms import SegformerTransform
from exceptions import DatasetException


class ADE20KDataset(Dataset):
    def __init__(
        self, root, img_dir, mask_dir, transforms: Union[SegformerTransform, T.Compose]
    ):
        try:
            self.root = root
            self.img_dir = os.path.join(root, img_dir)
            self.mask_dir = os.path.join(root, mask_dir)

            self.images = sorted(os.listdir(self.img_dir))
            self.masks = sorted(os.listdir(self.mask_dir))

            self.transforms = transforms
        except Exception as e:
            raise DatasetException(f"Failed to initialize: {str(e)}") from e

    def __getitem__(self, idx):
        try:
            img_path = os.path.join(self.img_dir, self.images[idx])
            mask_path = os.path.join(self.mask_dir, self.masks[idx])

            img = Image.open(img_path).convert("RGB")
            mask = (
                np.array(Image.open(mask_path), dtype=np.uint8) - 1
            )  # Adjust mask labels to start from 0
            img, mask = self.transforms(images=img, masks=mask)

            return img, mask
        except Exception as e:
            raise DatasetException(f"loading index {idx}: {str(e)}") from e

    def __len__(self):
        return len(self.images)
