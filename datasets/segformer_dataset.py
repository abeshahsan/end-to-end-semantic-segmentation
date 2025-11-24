import os
from PIL import Image
from torch.utils.data import Dataset
import torchvision.transforms as T
import torchvision.transforms.functional as TF

class SegmentationDataset(Dataset):
    def __init__(self, root, img_dir, mask_dir, img_size, transforms=None):
        self.root = root
        self.img_dir = os.path.join(root, img_dir)
        self.mask_dir = os.path.join(root, mask_dir)

        self.images = sorted(os.listdir(self.img_dir))
        self.masks = sorted(os.listdir(self.mask_dir))

        self.img_size = img_size
        self.transforms = transforms or self.default_transforms()

    def default_transforms(self):
        return T.Compose([
            T.Resize((self.img_size, self.img_size)),
            T.ToTensor(),
        ])

    def __getitem__(self, idx):
        img_path = os.path.join(self.img_dir, self.images[idx])
        mask_path = os.path.join(self.mask_dir, self.masks[idx])

        img = Image.open(img_path).convert('RGB')
        mask = Image.open(mask_path)
        img = self.transforms(img)
        mask = TF.resize(mask, (self.img_size, self.img_size), interpolation=Image.NEAREST)
        mask = TF.pil_to_tensor(mask).long().squeeze(0)

        return img, mask

    def __len__(self):
        return len(self.images)
