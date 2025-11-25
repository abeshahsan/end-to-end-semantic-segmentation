# from torch.utils.data import Dataset
# import os
# from PIL import Image
# import numpy as np
# import torchvision.transforms as T
# import torchvision.transforms.functional as TF

# from datasets.transforms import SegformerTransform


# class SegmentationDataset(Dataset):
#     def __init__(self, root, img_dir, mask_dir, img_size, transforms=None):
#         self.root = root
#         self.img_dir = os.path.join(root, img_dir)
#         self.mask_dir = os.path.join(root, mask_dir)

#         self.images = sorted(os.listdir(self.img_dir))
#         self.masks = sorted(os.listdir(self.mask_dir))

#         self.img_size = img_size
#         self.transforms: SegformerTransform = (
#             transforms if transforms is not None else self.default_transforms()
#         )

#     def default_transforms(self):
#         return T.Compose(
#             [
#                 T.Resize((self.img_size, self.img_size)),
#                 T.ToTensor(),
#             ]
#         )

#     def __getitem__(self, idx):
#         img_path = os.path.join(self.img_dir, self.images[idx])
#         mask_path = os.path.join(self.mask_dir, self.masks[idx])

#         img = Image.open(img_path).convert("RGB")
#         mask = (
#             np.array(Image.open(mask_path), dtype=np.uint8) - 1
#         )  # Adjust mask labels to start from 0
#         img, mask = self.transforms(images=img, masks=mask)

#         return img, mask

#     def __len__(self):
#         return len(self.images)
