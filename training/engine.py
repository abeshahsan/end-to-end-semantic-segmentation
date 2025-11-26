import warnings

warnings.filterwarnings("ignore")


import os
import hydra
import torch
from torch.utils.data import DataLoader
import pytorch_lightning as pl
from transformers import SegformerConfig, SegformerForSemanticSegmentation
from datasets.segformer_dataset import ADE20KDataset
from models.lit_wrappers import SegformerLitWrapper
from models.lit_wrappers.segformer_wrapper import SegformerLitConfig
from utils.constants import PROJECT_ROOT
from datasets.transforms import SegformerTransform

from exceptions import TrainingException

from transformers import (
    SegformerConfig,
    SegformerForSemanticSegmentation,
    SegformerImageProcessor,
)

import logging

logger = logging.getLogger("sem_seg")


@hydra.main(
    config_path=f"{PROJECT_ROOT}/configs", config_name="train", version_base=None
)
def run_training(cfg):
    logger.info("Starting training process")

    try:
        segformer_config = SegformerConfig.from_pretrained(
            cfg.models.segformer.variant.b0.huggingface_name
        )
        segformer_improc = SegformerImageProcessor.from_pretrained(
            cfg.models.segformer.variant.b0.huggingface_name
        )

        segformerlit_config = SegformerLitConfig(
            learning_rate=cfg.lit_wrapper.segformer.learning_rate,
            weight_decay=cfg.lit_wrapper.segformer.weight_decay,
            num_classes=cfg.dataset.num_classes,
            ignore_index=cfg.dataset.ignore_index,
        )
    except Exception as e:
        raise TrainingException(f"Failed to build configs: {e}")

    logger.info("Configs built successfully")

    try:
        transform = SegformerTransform(image_processor=segformer_improc)
        train_dataset = ADE20KDataset(
            root=os.path.join(PROJECT_ROOT, cfg.paths.dataset_root),
            img_dir=cfg.paths.train_images,
            mask_dir=cfg.paths.train_masks,
            transforms=transform,
        )
        val_dataset = ADE20KDataset(
            root=os.path.join(PROJECT_ROOT, cfg.paths.dataset_root),
            img_dir=cfg.paths.val_images,
            mask_dir=cfg.paths.val_masks,
            transforms=transform,
        )

        train_loader = DataLoader(dataset=train_dataset, **cfg.dataloader.train)
        val_loader = DataLoader(dataset=val_dataset, **cfg.dataloader.val)
    except Exception as e:
        raise TrainingException(f"Failed to set up datasets or dataloaders: {e}")

    try:
        segformer_model = SegformerForSemanticSegmentation(segformer_config)

        lit_model = SegformerLitWrapper(
            model=segformer_model, config=segformerlit_config
        )
    except Exception as e:
        raise TrainingException(f"Failed to set up models: {e}")

    logger.info("Model and transforms set up successfully")

    try:

        trainer = pl.Trainer(
            max_epochs=cfg.trainer.max_epochs,
            precision=cfg.trainer.precision,
            log_every_n_steps=cfg.trainer.log_every_n_steps,
            accelerator="gpu" if torch.cuda.is_available() else "cpu",
            devices=1 if torch.cuda.is_available() else None,
            enable_checkpointing=cfg.trainer.enable_checkpointing,
            enable_progress_bar=cfg.trainer.enable_progress_bar,
            enable_model_summary=cfg.trainer.enable_model_summary,
            default_root_dir=PROJECT_ROOT,
        )
    except Exception as e:
        raise TrainingException(f"Failed to initialize trainer: {e}")

    logger.info("Trainer initialized successfully")

    try:
        trainer.fit(
            lit_model, train_dataloaders=train_loader, val_dataloaders=val_loader
        )
    except Exception as e:
        raise TrainingException(f"Training failed: {e}")
