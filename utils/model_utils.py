import logging

logger = logging.getLogger(__name__)

AVAILABLE_MODELS = ["HFSegformer"]
AVAILABLE_MODEL_TYPES = ["accurate", "fast", "balanced"]

def select_model(model_type: str):
    if model_type == "accurate":
        return "HFSegformer"
    elif model_type == "fast":
        return "HFSegformer"  # Placeholder for a fast model
    elif model_type == "balanced":
        return "HFSegformer"  # Placeholder for a balanced model
    else:
        raise ValueError(f"Unknown model type: {model_type}")

def load_model(model_name: str):
    if model_name == "HFSegformer":
        from models import HFSegformer
        from datasets.transforms import SegformerTransform

        model = HFSegformer.from_pretrained("nvidia/segformer-b0-finetuned-ade-512-512")
        transform = SegformerTransform.from_pretrained(
            "nvidia/segformer-b0-finetuned-ade-512-512"
        )
        return model, transform
