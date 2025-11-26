import logging
import datetime
import os
from lightning_utilities.core.rank_zero import rank_zero_only
from utils.constants import PROJECT_ROOT

LOG_FOLDER = f"{PROJECT_ROOT}/logs"
LOGGER_NAME = "sem_seg"
os.makedirs(LOG_FOLDER, exist_ok=True)


@rank_zero_only  # ensures ONLY main process initializes logging
def setup_logger():
    logger = logging.getLogger(LOGGER_NAME)
    logger.setLevel(logging.INFO)
    logger.propagate = False

    # --- prevent re-adding handlers (main process only) ---
    if not logger.handlers:
        dt = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        log_filename = f"{LOG_FOLDER}/{LOGGER_NAME}_log_{dt}.log"

        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )

        # file handler
        file_handler = logging.FileHandler(log_filename)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

        # stdout handler
        stream_handler = logging.StreamHandler()
        stream_handler.setFormatter(formatter)
        logger.addHandler(stream_handler)

        logger.info(f"Logger initialized. Logging to: {log_filename}")

    return logger
