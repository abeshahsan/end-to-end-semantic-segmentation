export interface ModelOption {
  id: string;
  name: string;
  description: string;
  speed: 'fast' | 'medium' | 'slow';
  accuracy: 'low' | 'medium' | 'high';
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    id: 'fast',
    name: 'Basic Fast',
    description: 'Quick results with lower detail',
    speed: 'fast',
    accuracy: 'medium',
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Good balance of speed and accuracy',
    speed: 'medium',
    accuracy: 'medium',
  },
  {
    id: 'accurate',
    name: 'High Accuracy',
    description: 'Best quality, slower processing',
    speed: 'slow',
    accuracy: 'high',
  },
];
