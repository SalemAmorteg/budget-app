import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// features/distribution/components/PercentageInput.tsx
import { useState, useEffect } from 'react';
export default function PercentageInput({ percentage, onChange, maxPercentage = 100, label, showInputValue = true, }) {
    const [inputValue, setInputValue] = useState(percentage.toString());
    useEffect(() => {
        setInputValue(percentage.toString());
    }, [percentage]);
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        if (value === '' || value === '-')
            return;
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
    return (_jsxs("div", { className: "space-y-2", children: [label && _jsx("label", { className: "block text-sm font-medium text-gray-700", children: label }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { type: "button", onClick: handleDecrement, className: "px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 font-bold", children: "\u2212" }), showInputValue && (_jsx("input", { type: "number", value: inputValue, onChange: handleInputChange, onBlur: handleInputBlur, min: "0", max: maxPercentage, step: "1", className: "flex-1 px-3 py-1 border border-gray-300 rounded text-center" })), _jsxs("span", { className: "text-sm font-semibold text-gray-700 min-w-12 text-right", children: [percentage.toFixed(2), "%"] }), _jsx("button", { type: "button", onClick: handleIncrement, className: "px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 font-bold", children: "+" })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-500 h-2 rounded-full transition-all", style: { width: `${(percentage / maxPercentage) * 100}%` } }) })] }));
}
