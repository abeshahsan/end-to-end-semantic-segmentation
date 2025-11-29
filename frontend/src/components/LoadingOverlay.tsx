import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  modelName: string;
  onCancel?: () => void;
}

export default function LoadingOverlay({ modelName, onCancel }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full" />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          Segmenting Your Image...
        </h2>
        <p className="text-slate-600 mb-1">
          Estimated time: <span className="font-medium">10-30 seconds</span>
        </p>
        <p className="text-sm text-slate-500">
          Model: <span className="font-medium">{modelName}</span>
        </p>

        <div className="mt-6 flex justify-center">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-6 px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel & Retry
          </button>
        )}
      </div>
    </div>
  );
}
