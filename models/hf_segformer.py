from transformers import (
    SegformerForSemanticSegmentation,
    SegformerConfig,
)


class HFSegformerConfig(SegformerConfig):
    pass


class HFSegformer(SegformerForSemanticSegmentation):
    pass
