import { AlertTriangle, AlertCircle, X, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import type { UploadError } from '../types';

interface ErrorBannerProps {
  error: UploadError;
  onDismiss: () => void;
  onRetry?: () => void;
}

export default function ErrorBanner({ error, onDismiss, onRetry }: ErrorBannerProps) {
  const isWarning = error.type === 'format';
  const Icon = isWarning ? AlertCircle : AlertTriangle;

  const externalLinks: Record<string, { text: string; url: string }> = {
    size: { text: 'TinyPNG.com', url: 'https://tinypng.com' },
    format: { text: 'CloudConvert.com', url: 'https://cloudconvert.com' },
  };

  const link = externalLinks[error.type];

  return (
    <div
      className={clsx(
        'rounded-lg p-4 mb-4 border',
        isWarning
          ? 'bg-amber-50 border-amber-200'
          : 'bg-red-50 border-red-200'
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon
          className={clsx(
            'w-5 h-5 shrink-0 mt-0.5',
            isWarning ? 'text-amber-500' : 'text-red-500'
          )}
        />
        <div className="flex-1">
          <h3
            className={clsx(
              'font-medium',
              isWarning ? 'text-amber-800' : 'text-red-800'
            )}
          >
            {isWarning ? 'Format Issue' : 'Upload Error'}
          </h3>
          <p
            className={clsx(
              'text-sm mt-1',
              isWarning ? 'text-amber-700' : 'text-red-700'
            )}
          >
            {error.message}
          </p>
          {error.details && (
            <p
              className={clsx(
                'text-sm mt-2',
                isWarning ? 'text-amber-600' : 'text-red-600'
              )}
            >
              {error.details}
            </p>
          )}
          {link && (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                'inline-flex items-center gap-1 text-sm font-medium mt-2 hover:underline',
                isWarning ? 'text-amber-700' : 'text-red-700'
              )}
            >
              Try {link.text}
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <div className="flex gap-3 mt-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className={clsx(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  isWarning
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                )}
              >
                Try Again
              </button>
            )}
            <button
              onClick={onDismiss}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
