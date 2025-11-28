from pydoc import describe
import traceback
import warnings

warnings.filterwarnings("ignore")

import logging
import os
from pathlib import Path
import argparse

from hydra.core import hydra_config
from omegaconf import DictConfig, OmegaConf

from inference import run_inference
from logger.sem_seg import setup_logger
from utils.constants import PROJECT_ROOT

argparser = argparse.ArgumentParser(description="Inference Script")
argparser.add_argument(
    "--full_tb",
    help="Whether to print full traceback on error",
    default=False,
    action="store_true",
)


def main(cfg: DictConfig) -> None:
    try:
        args = argparser.parse_args()

        setup_logger(None, logging.INFO)

        inference_input_dir = os.path.join(
            f"{PROJECT_ROOT}", cfg.paths.inference_inputs
        )
        input_paths = os.listdir(inference_input_dir)

        for i in range(len(input_paths)):
            input_paths[i] = os.path.join(inference_input_dir, input_paths[i])

        run_inference(cfg, image_paths=input_paths)
    except Exception as e:
        if args.full_tb:
            logging.error(traceback.format_exc())
        else:
            logging.error(f"{str(e)}")


if __name__ == "__main__":
    cfg = OmegaConf.load(Path(f"{PROJECT_ROOT}/configs/infer.yaml").resolve())
    main(cfg)
