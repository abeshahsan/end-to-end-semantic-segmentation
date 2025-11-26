from training.engine import run_training

if __name__ == "__main__":
    try:
        run_training()
    except Exception as e:
        print(e)
