import sys
from typing import Dict, Optional


class SemSegBaseException(Exception):
    """Base exception for the semantic segmentation project."""

    def __init__(self, message: str):
        super().__init__(message)
        self.message = message

    def __str__(self):
        _, _, exc_tb = sys.exc_info()
        fname = exc_tb.tb_frame.f_code.co_filename if exc_tb else "Unknown"
        line_no = exc_tb.tb_lineno if exc_tb else "Unknown"
        return (
            f"[{self.__class__.__name__}] in {fname} at line {line_no}: {self.message}"
        )


# New exceptions for common failure modes (deployment-friendly)
class ConfigError(SemSegBaseException):
    """Raised when configuration loading or validation fails."""

    pass


class DataLoadError(SemSegBaseException):
    """Raised when dataset files cannot be read or parsed."""

    pass


class PreprocessingError(SemSegBaseException):
    """Raised during input preprocessing (transforms, normalization, etc.)."""

    pass


class PostprocessingError(SemSegBaseException):
    """Raised during postprocessing (argmax, color mapping, resizing)."""

    pass


class ModelLoadError(SemSegBaseException):
    """Raised when model weights or architecture cannot be loaded."""

    pass


class InferenceError(SemSegBaseException):
    """Raised when model inference fails at runtime."""

    pass


class CheckpointError(SemSegBaseException):
    """Raised when saving or restoring checkpoints fails."""

    pass


class DeviceError(SemSegBaseException):
    """Raised when device (CPU/GPU) allocation or compatibility fails."""

    pass


class DependencyError(SemSegBaseException):
    """Raised when an external dependency is missing or incompatible."""

    pass


class APIRequestError(SemSegBaseException):
    """Raised for invalid API requests (bad input, missing fields, etc.)."""

    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message)
        self.status_code = status_code


# # Optional helper: map exceptions to HTTP status codes (useful for FastAPI exception handlers)
# EXCEPTION_HTTP_STATUS: Dict[type, int] = {
#     ConfigError: 400,
#     DataLoadError: 500,
#     PreprocessingError: 400,
#     PostprocessingError: 500,
#     ModelLoadError: 500,
#     InferenceError: 500,
#     CheckpointError: 500,
#     DeviceError: 500,
#     DependencyError: 500,
#     APIRequestError: 400,
# }
