from logger import logger
import torch

gpu_message = (
    "CUDA is available. Using GPU for computations."
    if torch.cuda.is_available()
    else "CUDA is not available. Using CPU for computations."
)

logger.info(gpu_message)
