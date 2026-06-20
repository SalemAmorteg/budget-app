// features/distribution/components/PercentageInput.tsx
import { useState, useEffect } from 'react';

interface PercentageInputProps {
  percentage: number;
  onChange: (percentage: number) => void;
  maxPercentage?: number;
  label?: string;
  showInputValue?: boolean;
}

export default function PercentageInput({
  percentage,
  onChange,
  maxPercentage = 100,
  label,
  showInputValue = true,
}: PercentageInputProps) {
  const [inputValue, setInputValue] = useState(percentage.toString());

  useEffect(() => {
    setInputValue(percentage.toString());
  }, [percentage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === '' || value === '-') return;

    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.min(Math.max(numValue, 0), maxPercentage);
      onChange(clampedValue);
    }
  };

  const handleInputBlur = () => {
    if (inputValue === '' || inputValue === '-') {
      onChange(0);
      setInputValue('0');
    }
  };

  const handleIncrement = () => {
    const newValue = Math.min(percentage + 1, maxPercentage);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleDecrement = () => {
    const newValue = Math.max(percentage - 1, 0);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 font-bold"
        >
          −
        </button>

        {showInputValue && (
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            min="0"
            max={maxPercentage}
            step="1"
            className="flex-1 px-3 py-1 border border-gray-300 rounded text-center"
          />
        )}

        <span className="text-sm font-semibold text-gray-700 min-w-12 text-right">
          {percentage.toFixed(2)}%
        </span>

        <button
          type="button"
          onClick={handleIncrement}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 font-bold"
        >
          +
        </button>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all"
          style={{ width: `${(percentage / maxPercentage) * 100}%` }}
        />
      </div>
    </div>
  );
}