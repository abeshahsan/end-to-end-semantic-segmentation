import { useState, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import DropZone from './DropZone';
import ModelSelector from './ModelSelector';
import ErrorBanner from './ErrorBanner';
import LoadingOverlay from './LoadingOverlay';
import ResultsView from './ResultsView';
import type { ModelOption, SegmentationResult, UploadError, AppState } from '../types';
import { segmentImage, validateFile } from '../services/api';

const MODELS: ModelOption[] = [
  {
    id: 'fast',
    name: 'Fast',
    description: 'Quick results with good accuracy. Best for quick testing.',
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Good balance between speed and accuracy.',
  },
  {
    id: 'accurate',
    name: 'Accurate',
    description: 'Highest accuracy but slower processing. Best for final results.',
  },
];

export default function UploadPage() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>(MODELS[0].id);
  const [error, setError] = useState<UploadError | null>(null);
  const [result, setResult] = useState<SegmentationResult | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    const validation = validateFile(file);
    if (!validation.valid && validation.error) {
      setError({
        type: validation.error.type,
        message: validation.error.message,
        details: validation.error.details,
      });
      return;
    }
    setError(null);
    setSelectedFile(file);
  }, []);

  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
  }, []);

  const handleDismissError = useCallback(() => {
    setError(null);
  }, []);

  const handleProcess = useCallback(async () => {
    if (!selectedFile) return;

    setAppState('processing');
    try {
      const segmentationResult = await segmentImage(selectedFile, selectedModel);
      setResult(segmentationResult);
      setAppState('results');
    } catch (err) {
      setError({
        type: 'network',
        message: 'Processing failed',
        details: err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.',
      });
      setAppState('error');
    }
  }, [selectedFile, selectedModel]);

  const handleCancel = useCallback(() => {
    setAppState('upload');
  }, []);

  const handleBack = useCallback(() => {
    setAppState('upload');
  }, []);

  const handleNewImage = useCallback(() => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setAppState('upload');
  }, []);

  const selectedModelName = MODELS.find((m) => m.id === selectedModel)?.name || selectedModel;

  // Results view
  if (appState === 'results' && result) {
    return <ResultsView result={result} onBack={handleBack} onNewImage={handleNewImage} />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Processing overlay */}
      {appState === 'processing' && (
        <LoadingOverlay modelName={selectedModelName} onCancel={handleCancel} />
      )}

      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-3">
          Semantic Segmentation
        </h1>
        <p className="text-slate-600 max-w-md mx-auto">
          Upload an image to segment it semantically. No account needed.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <ErrorBanner
          error={error}
          onDismiss={handleDismissError}
          onRetry={handleClearFile}
        />
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <DropZone
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
          onClear={handleClearFile}
          disabled={appState === 'processing'}
        />
      </div>

      {/* Model Selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <ModelSelector
          models={MODELS}
          selectedModel={selectedModel}
          onSelect={setSelectedModel}
          disabled={appState === 'processing'}
        />
      </div>

      {/* Process Button */}
      <button
        onClick={handleProcess}
        disabled={!selectedFile || appState === 'processing'}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
      >
        <Sparkles className="w-5 h-5" />
        Process Image
      </button>

      {/* Footer Guidelines */}
      <p className="text-center text-sm text-slate-500 mt-6">
        Supports JPG/PNG up to 10MB. No account needed.
      </p>
    </div>
  );
}
