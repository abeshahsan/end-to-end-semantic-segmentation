import { useState, useRef, useCallback, useEffect } from 'react';
import { ZoomIn, ZoomOut, Download, Copy, Check, ArrowLeft, RefreshCw, Move } from 'lucide-react';
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
  
  // Pan/drag state
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef1 = useRef<HTMLDivElement>(null);
  const containerRef2 = useRef<HTMLDivElement>(null);
  const imageGridRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 300));
  const handleZoomOut = () => {
    setZoom((z) => Math.max(z - 25, 25));
  };

  // Mouse drag handlers - works at any zoom level
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    e.preventDefault();
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    setPosition({ x: newX, y: newY });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Scroll wheel zoom handler - using native event listener to properly prevent default
  useEffect(() => {
    const element = imageGridRef.current;
    if (!element) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY > 0 ? -10 : 10;
      setZoom((z) => Math.min(Math.max(z + delta, 25), 300));
    };

    element.addEventListener('wheel', handleWheel, { passive: false });
    return () => element.removeEventListener('wheel', handleWheel);
  }, []);

  // Reset pan position
  const handleResetView = useCallback(() => {
    setPosition({ x: 0, y: 0 });
    setZoom(100);
  }, []);

  const handleCopyEndpoint = async () => {
    await navigator.clipboard.writeText(`POST /segment?model=${result.modelUsed}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (type: 'mask' | 'full' | 'metadata') => {
    let url: string;
    let filename: string;
    
    // Get base name without extension
    const baseName = result.imageName.replace(/\.[^/.]+$/, '');
    const prefix = `segment_ai_${baseName}`;

    switch (type) {
      case 'mask':
        url = result.maskImage;
        filename = `${prefix}_mask.png`;
        break;
      case 'full':
        url = result.segmentedImage;
        filename = `${prefix}_result.jpg`;
        break;
      case 'metadata': {
        const metadata = JSON.stringify(result.metadata, null, 2);
        url = `data:application/json;charset=utf-8,${encodeURIComponent(metadata)}`;
        filename = `${prefix}_metadata.json`;
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
          <div className="flex items-center">
            <span className="text-slate-500">Image:</span>{' '}
            <span 
              className="font-semibold text-slate-800 max-w-[150px] truncate inline-block align-bottom"
              title={result.imageName}
            >
              {result.imageName}
            </span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-slate-300" />
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
          <button
            onClick={handleResetView}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors ml-2"
            aria-label="Reset view"
            title="Reset zoom and position"
          >
            <Move className="w-4 h-4 text-slate-600" />
          </button>
          <span className="text-xs text-slate-500 ml-2">Drag to pan</span>
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
      <div 
        ref={imageGridRef}
        className="grid md:grid-cols-2 gap-4 mb-8 select-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className="bg-slate-100 rounded-xl p-4">
          <h3 className="text-sm font-medium text-slate-600 mb-3">Original Image</h3>
          <div 
            ref={containerRef1}
            onMouseDown={handleMouseDown}
            className={clsx(
              "overflow-hidden rounded-lg bg-white flex items-center justify-center",
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            )}
            style={{ height: '400px' }}
          >
            <div 
              className="flex items-center justify-center w-full h-full"
              style={{ 
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100})`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                transformOrigin: 'center center'
              }}
            >
              <img
                src={result.originalImage}
                alt="Original"
                className="max-w-full max-h-full object-contain select-none pointer-events-none"
                draggable={false}
              />
            </div>
          </div>
        </div>
        <div className="bg-slate-100 rounded-xl p-4">
          <h3 className="text-sm font-medium text-slate-600 mb-3">Segmented Output</h3>
          <div 
            ref={containerRef2}
            onMouseDown={handleMouseDown}
            className={clsx(
              "overflow-hidden rounded-lg bg-white flex items-center justify-center",
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            )}
            style={{ height: '400px' }}
          >
            <div 
              className="flex items-center justify-center w-full h-full"
              style={{ 
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100})`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                transformOrigin: 'center center'
              }}
            >
              <img
                src={overlayMode === 'mask' ? result.maskImage : result.segmentedImage}
                alt="Segmented"
                className="max-w-full max-h-full object-contain select-none pointer-events-none"
                style={{ 
                  opacity: overlayMode === 'blend' ? 0.8 : 1
                }}
                draggable={false}
              />
            </div>
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
