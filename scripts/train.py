import warnings

warnings.filterwarnings("ignore")

import logging
import os
from pathlib import Path

import hydra
from hydra.core import hydra_config
from omegaconf import DictConfig

from logger.sem_seg import setup_logger
from training.engine import run_training
from utils.constants import PROJECT_ROOT


@hydra.main(
    config_path=f"{PROJECT_ROOT}/configs", config_name="train", version_base=None
)
def main(cfg: DictConfig) -> None:
    hydra_output_dir = hydra_config.HydraConfig.get().runtime.output_dir
    log_dir = os.path.join(hydra_output_dir, "sem_seg")
    os.makedirs(log_dir, exist_ok=True)
    log_file = f"{log_dir}/{Path(__file__).stem}.log"

    setup_logger(log_file, logging.INFO)

    run_training(cfg)


if __name__ == "__main__":
    main()
