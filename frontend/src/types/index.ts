import type { LucideIcon } from 'lucide-react';

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  icon?: LucideIcon;
}

export interface SegmentationResult {
  originalImage: string;
  segmentedImage: string;
  maskImage: string;
  processingTime: number;
  modelUsed: string;
  confidence: number;
  imageName: string;
  metadata: {
    classes: string[];
    width: number;
    height: number;
  };
}

export interface UploadError {
  type: 'size' | 'format' | 'network' | 'unknown';
  message: string;
  details?: string;
}

export type AppState = 'upload' | 'processing' | 'results' | 'error';
