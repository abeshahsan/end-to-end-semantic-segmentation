import logging
import datetime
import os

LOG_FOLDER = "logs"
LOGGER_NAME = "sem-seg"
if not os.path.exists(LOG_FOLDER):
    os.makedirs(LOG_FOLDER)

logger = logging.getLogger(LOGGER_NAME)
dt = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
log_filename = f"{LOG_FOLDER}/{LOGGER_NAME}_log_{dt}.log"
fileHandler = logging.FileHandler(log_filename)
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")

fileHandler.setFormatter(formatter)
logger.addHandler(fileHandler)

streamHandler = logging.StreamHandler()
streamHandler.setFormatter(formatter)
logger.addHandler(streamHandler)

logger.setLevel(logging.INFO)

logger.info(f"Logger initialized, logging to {log_filename}")
