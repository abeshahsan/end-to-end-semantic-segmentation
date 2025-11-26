from training.engine import run_training
from logger import setup_logger

if __name__ == "__main__":
    setup_logger()
    try:
        run_training()
    except Exception as e:
        print(e)
