from pathlib import Path
from typing import List

"""project.template

Small scaffolding script to create a recommended project folder structure
for an end-to-end semantic segmentation project. This file is intended to be
kept in the project root and can be run to create missing directories and
placeholder files.

Usage:
    python template.py

You can edit the `structure` list below to add or remove files and folders
before running the script.
"""

# use this structre to manage paths
"""
project/
│
├── configs/                 # YAML configs for training, inference, paths
│   ├── train.yaml
│   ├── model.yaml
│   └── inference.yaml
│
├── data/                    # your local dataset (not in repo)
|   ├── __init__.py
│   ├── raw/
|       ├── __init__.py
│   ├── processed/
│       ├── __init__.py
│   └── splits/
│       ├── __init__.py
│
├── datasets/                # data loaders
│   ├── __init__.py
│   ├── transforms.py
│   └── segmentation_dataset.py
│
├── models/                  # model architectures & pretrained loaders
|   ├── __init__.py
│   ├── unet.py
│   ├── deeplab.py
│   └── load_pretrained.py
│
├── training/                # training-related logic
│   ├── __init__.py          # training loop, validation loop
│   ├── engine.py            
│   ├── loss.py
│   ├── metrics.py
│   └── trainer.py           # orchestrates the training
│
├── inference/               # for users, deployment
|   ├── __init__.py
│   ├── predictor.py         # preprocess → predict → postprocess
│   └── visualize.py         # overlay masks, color maps
│
├── api/                     # backend for serving
│   └── main.py              # FastAPI/Flask service
│
├── frontend / (optional)           # streamlit / web frontend
│
├── utils/                   # shared helpers
│   ├── __init__.py
│   ├── logger.py
│   ├── file_utils.py
│   └── model_utils.py
│
├── scripts/                 # short runnable scripts
│   ├── train.py
│   ├── eval.py
│   ├── infer.py
│   └── export.py            # export to ONNX / TorchScript
│
├── experiments/             # saved metrics, logs, tensorboard
│
├── saved_models/            # checkpoints + exported models
│
├── Dockerfile
├── requirements.txt
└── README.md
"""

PROJECT_FOLDER = Path(__file__).parent.resolve()
print(f"Project folder set to: {PROJECT_FOLDER}")

# List of files (and folders) to ensure exist in the project. Edit as needed.
structure: List[str] = [
    f"{PROJECT_FOLDER}/configs/train.yaml",
    f"{PROJECT_FOLDER}/configs/model.yaml",
    f"{PROJECT_FOLDER}/configs/inference.yaml",
    f"{PROJECT_FOLDER}/data/__init__.py",
    f"{PROJECT_FOLDER}/data/raw/__init__.py",
    f"{PROJECT_FOLDER}/data/processed/__init__.py",
    f"{PROJECT_FOLDER}/data/splits/__init__.py",
    f"{PROJECT_FOLDER}/datasets/__init__.py",
    f"{PROJECT_FOLDER}/datasets/transforms.py",
    f"{PROJECT_FOLDER}/datasets/segmentation_dataset.py",
    f"{PROJECT_FOLDER}/models/__init__.py",
    f"{PROJECT_FOLDER}/training/__init__.py",
    f"{PROJECT_FOLDER}/training/engine.py",
    f"{PROJECT_FOLDER}/training/loss.py",
    f"{PROJECT_FOLDER}/training/metrics.py",
    f"{PROJECT_FOLDER}/training/trainer.py",
    f"{PROJECT_FOLDER}/inference/__init__.py",
    f"{PROJECT_FOLDER}/inference/predictor.py",
    f"{PROJECT_FOLDER}/inference/visualize.py",
    f"{PROJECT_FOLDER}/api/main.py",
    f"{PROJECT_FOLDER}/frontend/__init__.py",
    f"{PROJECT_FOLDER}/utils/__init__.py",
    f"{PROJECT_FOLDER}/utils/logger.py",
    f"{PROJECT_FOLDER}/utils/file_utils.py",
    f"{PROJECT_FOLDER}/utils/model_utils.py",
    f"{PROJECT_FOLDER}/scripts/train.py",
    f"{PROJECT_FOLDER}/scripts/eval.py",
    f"{PROJECT_FOLDER}/scripts/infer.py",
    f"{PROJECT_FOLDER}/scripts/export.py",
    f"{PROJECT_FOLDER}/experiments/.gitkeep",
    f"{PROJECT_FOLDER}/saved_models/.gitkeep",
    f"{PROJECT_FOLDER}/Dockerfile",
    f"{PROJECT_FOLDER}/requirements.txt",
    f"{PROJECT_FOLDER}/README.md",
    f"{PROJECT_FOLDER}/setup.py",
    f"{PROJECT_FOLDER}/demo.py",
]

def create_project_structure(structure: List[str]) -> None:
    """Create directories and placeholder files from `structure` list.

    Each entry in `structure` should be a path (string) pointing to a file
    that should exist in the project tree. Parent directories will be
    created if they do not exist. Placeholder content is written for
    Python and YAML files so they are visible in version control.

    Args:
        structure: List of file paths (absolute or relative to this script).
    """

    for path_str in structure:
        path = Path(path_str)
        parent_dir = path.parent

        # Ensure parent directory exists
        if not parent_dir.exists():
            parent_dir.mkdir(parents=True, exist_ok=True)
            print(f"Created directory: {parent_dir}")

        # If the file doesn't exist, create a small placeholder
        if not path.exists():
            if path.suffix == '.py':
                content = "# Auto-generated file by template.py\n"
            elif path.suffix in ['.yaml', '.yml']:
                content = "# YAML configuration file\n"
            
            if "setup.py" in path.name:
                content = (
                    "from setuptools import setup, find_packages\n\n"
                    "setup(\n"
                    "    name='end-to-end-semantic-segmentation',\n"
                    "    packages=find_packages(),\n"
                    "    install_requires=[],  # Add your dependencies here\n"
                    ")\n"
                )
            else:
                content = ""
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Created file: {path}")

create_project_structure(structure)