import { useState } from 'react';
import { ZoomIn, ZoomOut, Download, Copy, Check, ArrowLeft, RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import type { SegmentationResult } from '../types';

interface ResultsViewProps {
  result: SegmentationResult;
  onBack: () => void;
  onNewImage: () => void;
}

export default function ResultsView({ result, onBack, onNewImage }: ResultsViewProps) {
  const [zoom, setZoom] = useState(100);
  const [overlayMode, setOverlayMode] = useState<'mask' | 'blend'>('mask');
  const [copied, setCopied] = useState(false);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50));

  const handleCopyEndpoint = async () => {
    await navigator.clipboard.writeText(`POST /segment?model=${result.modelUsed}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (type: 'mask' | 'full' | 'metadata') => {
    let url: string;
    let filename: string;

    switch (type) {
      case 'mask':
        url = result.maskImage;
        filename = 'segmentation-mask.png';
        break;
      case 'full':
        url = result.segmentedImage;
        filename = 'segmented-result.jpg';
        break;
      case 'metadata': {
        const metadata = JSON.stringify(result.metadata, null, 2);
        url = `data:application/json;charset=utf-8,${encodeURIComponent(metadata)}`;
        filename = 'segmentation-metadata.json';
        break;
      }
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Stats Bar */}
      <div className="bg-slate-100 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div>
            <span className="text-slate-500">Processing Time:</span>{' '}
            <span className="font-semibold text-slate-800">{result.processingTime.toFixed(1)}s</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-slate-300" />
          <div>
            <span className="text-slate-500">Model:</span>{' '}
            <span className="font-semibold text-slate-800">{result.modelUsed}</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-slate-300" />
          <div>
            <span className="text-slate-500">Confidence:</span>{' '}
            <span className="font-semibold text-green-600">{result.confidence}%</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-slate-600" />
          </button>
          <span className="text-sm font-medium text-slate-600 w-12 text-center">{zoom}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setOverlayMode('mask')}
            className={clsx(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              overlayMode === 'mask'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            )}
          >
            Mask
          </button>
          <button
            onClick={() => setOverlayMode('blend')}
            className={clsx(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
              overlayMode === 'blend'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            )}
          >
            Blend
          </button>
        </div>
      </div>

      {/* Image Comparison */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-100 rounded-xl p-4">
          <h3 className="text-sm font-medium text-slate-600 mb-3">Original Image</h3>
          <div className="overflow-auto rounded-lg bg-white" style={{ maxHeight: '400px' }}>
            <img
              src={result.originalImage}
              alt="Original"
              className="mx-auto transition-transform duration-200"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
            />
          </div>
        </div>
        <div className="bg-slate-100 rounded-xl p-4">
          <h3 className="text-sm font-medium text-slate-600 mb-3">Segmented Output</h3>
          <div className="overflow-auto rounded-lg bg-white" style={{ maxHeight: '400px' }}>
            <img
              src={overlayMode === 'mask' ? result.maskImage : result.segmentedImage}
              alt="Segmented"
              className="mx-auto transition-transform duration-200"
              style={{ 
                transform: `scale(${zoom / 100})`, 
                transformOrigin: 'top left',
                opacity: overlayMode === 'blend' ? 0.8 : 1
              }}
            />
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Export Your Results</h3>
        
        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => handleDownload('mask')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-slate-700">Mask PNG</span>
          </button>
          <button
            onClick={() => handleDownload('full')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-slate-700">Full JPG</span>
          </button>
          <button
            onClick={() => handleDownload('metadata')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-slate-700">Metadata JSON</span>
          </button>
        </div>

        <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg">
          <span className="text-sm text-slate-600">API Endpoint:</span>
          <code className="flex-1 text-sm font-mono text-slate-700 truncate">
            POST /segment?model={result.modelUsed}
          </code>
          <button
            onClick={handleCopyEndpoint}
            className="p-2 rounded-md hover:bg-slate-200 transition-colors"
            aria-label="Copy API endpoint"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Upload
        </button>
        <button
          onClick={onNewImage}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          New Image
        </button>
      </div>
    </div>
  );
}
