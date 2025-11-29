export interface SegmentClass {
  name: string;
  confidence: number;
  color: string;
}

export interface SegmentMetadata {
  modelId: string;
  fileName: string;
  generatedAt: string;
  classes: SegmentClass[];
}

// ViewState is a string literal for the app's current view
export type ViewState = 'upload' | 'loading' | 'result';

// Original ViewState object interface (if needed elsewhere)
export interface ViewSettings {
  zoom: number;
  showOverlay: boolean;
  blendMode: 'mask' | 'blend';
}
