from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from PIL import Image
import io
import base64
import numpy as np
import torch

from inference.predictor import run_inference
from utils.constants import PROJECT_ROOT
from utils.model_utils import load_model, select_model
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DIST_DIR = Path(f"{PROJECT_ROOT}/frontend/dist")
INDEX = DIST_DIR / "index.html"
MOCK_MASK_PATH = Path("photo-bugs.png")

# Manual classnames for postprocessing (edit as needed)
CLASS_NAMES = ["background", "person", "car", "building", "vegetation"]


# Serve static assets
app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets")


@app.get("/favicon.svg")
async def favicon():
    return FileResponse(DIST_DIR / "favicon.svg")


def image_to_base64(img: Image.Image, format: str = "PNG") -> str:
    """Convert PIL Image to base64 string."""
    buffer = io.BytesIO()
    img.save(buffer, format=format)
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


@app.post("/segment")
async def segment(
    image: UploadFile = File(...),
    mask_format: str = "png",
    model: str = "accurate",
):
    """
    Segment an image.

    Query params:
    - mask_format: "png" or "json" (default: "png")

    Returns JSON with base64-encoded mask.
    """
    # Load uploaded image to get dimensions
    img = Image.open(image.file).convert("RGB")
    width, height = img.size

    # Run inference via models.infer_image (returns HxW numpy array of class ids)
    try:
        model_obj, transform = load_model(select_model(model))
        mask_img = run_inference(
            model=model_obj,
            transform=transform,
            images=img,
            return_type="pil",
            device="cuda" if torch.cuda.is_available() else "cpu",
            colormap=True,
        )

    except Exception:
        logger.exception("Inference failed")
        return JSONResponse(
            {
                "success": False,
                "error": "Inference failed. Please check the server logs for details.",
            },
            status_code=500,
        )

    # Build response
    response = {
        "mask": image_to_base64(mask_img, format=mask_format.upper()),
        "success": True,
        "width": width,
        "height": height,
        "classes": CLASS_NAMES,
        "model": model,
    }

    return JSONResponse(response)


@app.get("/{full_path:path}")
async def spa(full_path: str):
    """Serve the SPA for all other routes."""
    return FileResponse(INDEX)
