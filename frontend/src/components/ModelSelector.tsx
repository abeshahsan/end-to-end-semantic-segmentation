import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import clsx from 'clsx';
import type { ModelOption } from '../types';

interface ModelSelectorProps {
  models: ModelOption[];
  selectedModel: string;
  onSelect: (modelId: string) => void;
  disabled?: boolean;
}

export default function ModelSelector({ models, selectedModel, onSelect, disabled }: ModelSelectorProps) {
  const selected = models.find((m) => m.id === selectedModel);

  return (
    <div>
      <label className="block text-sm font-medium text-stone-600 mb-3">
        Select Model
      </label>
      
      <div className="grid grid-cols-3 gap-3">
        {models.map((model) => {
          const isSelected = model.id === selectedModel;
          const Icon = model.icon;
          
          return (
            <motion.button
              key={model.id}
              onClick={() => !disabled && onSelect(model.id)}
              disabled={disabled}
              className={clsx(
                'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2',
                isSelected
                  ? 'border-teal-500 bg-teal-50/50'
                  : 'border-stone-200 hover:border-teal-300 hover:bg-stone-50',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              whileHover={{ scale: disabled ? 1 : 1.02 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
            >
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center shadow-md"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className={clsx(
                'p-2 rounded-lg transition-colors',
                isSelected ? 'bg-teal-100' : 'bg-stone-100'
              )}>
                {Icon && <Icon className={clsx(
                  'w-5 h-5',
                  isSelected ? 'text-teal-600' : 'text-stone-500'
                )} />}
              </div>
              
              <span className={clsx(
                'text-sm font-medium',
                isSelected ? 'text-teal-700' : 'text-stone-600'
              )}>
                {model.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.p 
            key={selected.id}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs text-stone-400 mt-3 text-center"
          >
            {selected.description}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
