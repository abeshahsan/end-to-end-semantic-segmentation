import pytorch_lightning as pl
import torch
from transformers import SegformerForSemanticSegmentation
import torchvision.transforms.functional as TF
from torchmetrics.classification import MulticlassAccuracy, MulticlassJaccardIndex
from logger import logger
from exceptions import SegformerLitException


class SegformerLitWrapper(pl.LightningModule):
    def __init__(
        self, model: SegformerForSemanticSegmentation, learning_rate: float = 1e-4
    ):
        try:
            super().__init__()
            self.model = model
            self.learning_rate = learning_rate
            self.criterion = torch.nn.CrossEntropyLoss(ignore_index=255)
            self.train_acc = MulticlassAccuracy(num_classes=150, ignore_index=255)
            self.val_acc = MulticlassAccuracy(num_classes=150, ignore_index=255)
            self.train_miou = MulticlassJaccardIndex(num_classes=150, ignore_index=255)
            self.val_miou = MulticlassJaccardIndex(num_classes=150, ignore_index=255)
        except Exception as e:
            raise SegformerLitException(f"Initialization failed: {str(e)}") from e

    def forward(self, x):
        return self.model(x)

    def training_step(self, batch, batch_idx):
        try:
            images, masks = batch
            outputs = self.model(images)
            logits = TF.resize(
                outputs.logits,
                size=masks.shape[1:],
                interpolation=TF.InterpolationMode.NEAREST,
            )
            preds = logits.argmax(dim=1)
            loss = self.criterion(logits, masks)
            self.log("train_loss", loss, prog_bar=True)
            self.log("train_acc", self.train_acc(preds, masks), prog_bar=True)
            self.log("train_miou", self.train_miou(preds, masks), prog_bar=True)

            return loss
        except Exception as e:
            raise SegformerLitException(
                f"Training step, batch {batch_idx}: {str(e)}"
            ) from e

    def validation_step(self, batch, batch_idx):
        try:
            images, masks = batch
            outputs = self.model(images)
            logits = outputs.logits
            logits = TF.resize(
                outputs.logits,
                size=masks.shape[1:],
                interpolation=TF.InterpolationMode.NEAREST,
            )
            preds = logits.argmax(dim=1)
            loss = self.criterion(logits, masks)
            self.log("val_loss", loss, prog_bar=True)
            self.log("val_acc", self.val_acc(preds, masks), prog_bar=True)
            self.log("val_miou", self.val_miou(preds, masks), prog_bar=True)
            return loss
        except Exception as e:
            raise SegformerLitException(
                f"Validation step, batch {batch_idx}: {str(e)}"
            ) from e

    def on_train_epoch_end(self) -> None:
        logger.info(f"Epoch {self.current_epoch} finished.")

    def configure_optimizers(self):
        optimizer = torch.optim.Adam(self.model.parameters(), lr=self.learning_rate)
        return optimizer
