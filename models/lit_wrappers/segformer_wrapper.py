from dataclasses import dataclass
import pytorch_lightning as pl
from sympy import beta
import torch
from transformers import SegformerForSemanticSegmentation
import torchvision.transforms.functional as TF
from torchmetrics.classification import MulticlassAccuracy, MulticlassJaccardIndex
from logger import logger
from exceptions import SegformerLitException


@dataclass
class SegformerLitConfig:
    num_classes: int
    ignore_index: int
    learning_rate: float
    weight_decay: float
    betas: tuple = (0.9, 0.999)


class SegformerLitWrapper(pl.LightningModule):
    def __init__(
        self, model: SegformerForSemanticSegmentation, config: SegformerLitConfig
    ):
        try:
            super().__init__()
            self.model = model
            self.config = config
            self.criterion = torch.nn.CrossEntropyLoss(ignore_index=config.ignore_index)
            self.acc = MulticlassAccuracy(
                num_classes=config.num_classes, ignore_index=config.ignore_index
            )
            self.jaccard = MulticlassJaccardIndex(
                num_classes=config.num_classes, ignore_index=config.ignore_index
            )
            self.save_hyperparameters(vars(config))
        except Exception as e:
            raise SegformerLitException(f"Initialization failed: {str(e)}") from e

    def forward(self, x):
        return self.model(x)

    def training_step(self, batch, batch_idx):
        try:
            images, masks = batch
            outputs = self(images)
            logits = TF.resize(
                outputs.logits,
                size=masks.shape[1:],
                interpolation=TF.InterpolationMode.NEAREST,
            )
            preds = logits.argmax(dim=1)
            loss = self.criterion(logits, masks)
            self.log("train_loss", loss, prog_bar=True)
            self.log("train_acc", self.acc(preds, masks), prog_bar=True)
            self.log("train_miou", self.jaccard(preds, masks), prog_bar=True)

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
            self.log("val_acc", self.acc(preds, masks), prog_bar=True)
            self.log("val_miou", self.jaccard(preds, masks), prog_bar=True)
            return loss
        except Exception as e:
            raise SegformerLitException(
                f"Validation step, batch {batch_idx}: {str(e)}"
            ) from e

    def on_train_epoch_end(self) -> None:
        logger.info(f"Epoch {self.current_epoch} finished.")

    def configure_optimizers(self):
        optimizer = torch.optim.Adam(
            self.model.parameters(),
            lr=self.config.learning_rate,
            weight_decay=self.config.weight_decay,
            betas=self.config.betas,
        )
        return optimizer
