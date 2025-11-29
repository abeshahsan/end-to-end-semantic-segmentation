import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  disabled?: boolean;
}

export default function DropZone({ onFileSelect, selectedFile, onClear, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [disabled, onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, [onFileSelect]);

  const handleClear = useCallback(() => {
    setPreview(null);
    onClear();
  }, [onClear]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={clsx(
        'relative border-2 border-dashed rounded-xl transition-all duration-200',
        'min-h-60 flex flex-col items-center justify-center p-6',
        isDragging && 'border-blue-500 bg-blue-50',
        !isDragging && !selectedFile && 'border-slate-300 hover:border-slate-400 bg-slate-50',
        selectedFile && 'border-green-400 bg-green-50',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {selectedFile && preview ? (
        <div className="relative w-full">
          <button
            onClick={handleClear}
            className="absolute -top-2 -right-2 z-10 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex flex-col items-center gap-3">
            <img
              src={preview}
              alt="Preview"
              className="max-h-40 max-w-full rounded-lg shadow-md object-contain"
            />
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">{selectedFile.name}</p>
              <p className="text-xs text-slate-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={disabled}
            aria-label="Upload image file"
          />
          <div className="flex flex-col items-center gap-3 pointer-events-none">
            <div className={clsx(
              'p-4 rounded-full transition-colors',
              isDragging ? 'bg-blue-100' : 'bg-slate-100'
            )}>
              {isDragging ? (
                <Upload className="w-8 h-8 text-blue-500" />
              ) : (
                <ImageIcon className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <div className="text-center">
              <p className="text-slate-700 font-medium">
                {isDragging ? 'Drop your image here' : 'Drag & drop your image here'}
              </p>
              <p className="text-sm text-slate-500 mt-1">or click to browse</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
