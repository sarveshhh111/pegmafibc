import React, { useState } from 'react';
import { Check, Edit3 } from 'lucide-react';

interface ColorOption {
  name: string;
  hex: string;
  border?: string;
}

interface ColorSelectorProps {
  options: ColorOption[];
  selectedColor: string;
  onChange: (colorName: string) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  options,
  selectedColor,
  onChange
}) => {
  const isPreset = options.some(opt => opt.name === selectedColor);
  const [isCustomMode, setIsCustomMode] = useState(!isPreset && Boolean(selectedColor));
  const [customValue, setCustomValue] = useState(!isPreset ? selectedColor : '');

  const handleSelectPreset = (name: string) => {
    setIsCustomMode(false);
    onChange(name);
  };

  const handleCustomSubmit = (val: string) => {
    setCustomValue(val);
    if (val.trim()) {
      onChange(val.trim());
    }
  };

  return (
    <div className="space-y-2.5 pt-1">
      <div className="flex flex-wrap gap-2.5">
        {options.map((opt) => {
          const isSelected = !isCustomMode && selectedColor === opt.name;
          return (
            <button
              key={opt.name}
              type="button"
              onClick={() => handleSelectPreset(opt.name)}
              className={`group relative flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-150 ${
                isSelected
                  ? 'border-pegma-red bg-pegma-red/5 dark:bg-pegma-red/10 text-pegma-red shadow-sm ring-1 ring-pegma-red'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <span
                className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center flex-shrink-0 shadow-inner"
                style={{ backgroundColor: opt.hex }}
              >
                {isSelected && (
                  <Check className={`w-2.5 h-2.5 ${['White', 'Beige / Tan', 'F8FAFC'].includes(opt.name) ? 'text-slate-900' : 'text-white'}`} />
                )}
              </span>
              <span>{opt.name}</span>
            </button>
          );
        })}

        {/* Custom Write-in Pill */}
        <button
          type="button"
          onClick={() => {
            setIsCustomMode(true);
            if (customValue.trim()) onChange(customValue.trim());
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
            isCustomMode
              ? 'border-pegma-red bg-pegma-red/10 text-pegma-red ring-1 ring-pegma-red'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
          }`}
        >
          <Edit3 className="w-3 h-3 text-slate-400" />
          <span>Custom Color...</span>
        </button>
      </div>

      {/* Write-in Input field */}
      {isCustomMode && (
        <div className="pt-1">
          <input
            type="text"
            placeholder="Type custom color (e.g. Vibrant Orange, Pantone 185C)..."
            value={customValue}
            onChange={(e) => handleCustomSubmit(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-pegma-red/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-pegma-red dark:text-white"
            autoFocus
          />
        </div>
      )}
    </div>
  );
};
