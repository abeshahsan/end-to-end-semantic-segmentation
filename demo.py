# from logger import logger
# import torch
# from transformers import SegformerForSemanticSegmentation, SegformerImageProcessor
# from PIL import Image
# from torch.nn import functional as F
# import matplotlib.pyplot as plt

# gpu_message = (
#     "CUDA is available. Using GPU for computations."
#     if torch.cuda.is_available()
#     else "CUDA is not available. Using CPU for computations."
# )

# logger.info(gpu_message)
# # 



# model_name = "nvidia/segformer-b5-finetuned-ade-640-640"

# processor_result = SegformerImageProcessor.from_pretrained(model_name)
# if isinstance(processor_result, tuple):
#     processor = processor_result[0]
# else:
#     processor = processor_result
# model = SegformerForSemanticSegmentation.from_pretrained(model_name)

# if isinstance(model, tuple):
#     model = model[0]
    

# image = Image.open("image.png").convert("RGB")
# inputs = processor(images=image, return_tensors="pt")

# with torch.no_grad():
#     outputs = model(**inputs)

# seg = outputs.logits  # (batch, 150, h, w) for ADE20K (150 classes)

from from_root import from_root
root_dir = from_root()
print(f"Root directory path: {root_dir}")