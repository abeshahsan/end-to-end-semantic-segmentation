import { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import clsx from 'clsx';
import type { ModelOption } from '../types';

interface ModelSelectorProps {
  models: ModelOption[];
  selectedModel: string;
  onSelect: (modelId: string) => void;
  disabled?: boolean;
}

export default function ModelSelector({ models, selectedModel, onSelect, disabled }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);

  const selected = models.find((m) => m.id === selectedModel);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Select Model
      </label>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={clsx(
          'w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all',
          'bg-white text-left',
          disabled
            ? 'border-slate-200 text-slate-400 cursor-not-allowed'
            : 'border-slate-300 hover:border-blue-400 text-slate-700'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="font-medium">{selected?.name || 'Select a model'}</span>
        <ChevronDown
          className={clsx(
            'w-5 h-5 text-slate-400 transition-transform',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>

      {isOpen && !disabled && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <ul
            className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden"
            role="listbox"
          >
            {models.map((model) => (
              <li
                key={model.id}
                onClick={() => {
                  onSelect(model.id);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setHoveredModel(model.id)}
                onMouseLeave={() => setHoveredModel(null)}
                className={clsx(
                  'px-4 py-3 cursor-pointer transition-colors',
                  model.id === selectedModel
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-slate-50 text-slate-700'
                )}
                role="option"
                aria-selected={model.id === selectedModel}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{model.name}</span>
                  <Info className="w-4 h-4 text-slate-400" />
                </div>
                {hoveredModel === model.id && (
                  <p className="text-xs text-slate-500 mt-1">{model.description}</p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {selected && (
        <p className="text-xs text-slate-500 mt-2">{selected.description}</p>
      )}
    </div>
  );
}
