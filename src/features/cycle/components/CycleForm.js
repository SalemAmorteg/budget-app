import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// features/cycle/components/CycleForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';
import { useForm } from '@shared/hooks/useForm';
import { CycleService } from '../services/cycleService';
import { formatDate } from '@shared/utils/dateFormat';
export default function CycleForm() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [apiError, setApiError] = useState('');
    const form = useForm({
        name: '',
        startDate: formatDate(new Date(), 'yyyy-MM-dd'),
        endDate: '',
        income: '',
        currency: 'COP',
    }, async (values) => {
        try {
            if (!user)
                return;
            setApiError('');
            const cycle = await CycleService.createCycle(user.id, {
                name: values.name,
                startDate: new Date(values.startDate),
                endDate: new Date(values.endDate),
                income: parseFloat(values.income),
                currency: values.currency,
            });
            navigate(`/cycle/${cycle.id}/distribute`);
        }
        catch (error) {
            setApiError(error instanceof Error ? error.message : 'Failed to create cycle');
        }
    }, (values) => {
        const errors = {};
        if (!values.name)
            errors.name = 'Cycle name is required';
        if (!values.startDate)
            errors.startDate = 'Start date is required';
        if (!values.endDate)
            errors.endDate = 'End date is required';
        if (!values.income)
            errors.income = 'Income is required';
        const endDate = new Date(values.endDate);
        const startDate = new Date(values.startDate);
        if (startDate && endDate && endDate <= startDate) {
            errors.endDate = 'End date must be after start date';
        }
        const incomeNum = parseFloat(values.income);
        if (incomeNum <= 0) {
            errors.income = 'Income must be greater than zero';
        }
        return errors;
    });
    return (_jsxs("div", { className: "max-w-2xl mx-auto py-8 px-4", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Create New Cycle" }), apiError && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded px-4 py-3 mb-6 text-red-700", children: apiError })), _jsxs("form", { onSubmit: form.handleSubmit, className: "space-y-6 bg-white p-6 rounded-lg shadow", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Cycle Name" }), _jsx("input", { type: "text", name: "name", value: form.values.name, onChange: form.handleChange, onBlur: form.handleBlur, placeholder: "e.g., June Salary", className: `w-full px-3 py-2 border rounded-lg ${form.touched.name && form.errors.name ? 'border-red-500' : 'border-gray-300'}` }), form.touched.name && form.errors.name && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: form.errors.name }))] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Start Date" }), _jsx("input", { type: "date", name: "startDate", value: form.values.startDate, onChange: form.handleChange, onBlur: form.handleBlur, className: `w-full px-3 py-2 border rounded-lg ${form.touched.startDate && form.errors.startDate
                                            ? 'border-red-500'
                                            : 'border-gray-300'}` }), form.touched.startDate && form.errors.startDate && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: form.errors.startDate }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "End Date" }), _jsx("input", { type: "date", name: "endDate", value: form.values.endDate, onChange: form.handleChange, onBlur: form.handleBlur, className: `w-full px-3 py-2 border rounded-lg ${form.touched.endDate && form.errors.endDate ? 'border-red-500' : 'border-gray-300'}` }), form.touched.endDate && form.errors.endDate && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: form.errors.endDate }))] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Income" }), _jsx("input", { type: "number", name: "income", value: form.values.income, onChange: form.handleChange, onBlur: form.handleBlur, placeholder: "0", step: "0.01", min: "0", className: `w-full px-3 py-2 border rounded-lg ${form.touched.income && form.errors.income ? 'border-red-500' : 'border-gray-300'}` }), form.touched.income && form.errors.income && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: form.errors.income }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Currency" }), _jsxs("select", { name: "currency", value: form.values.currency, onChange: form.handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg", children: [_jsx("option", { value: "COP", children: "COP (Colombian Peso)" }), _jsx("option", { value: "USD", children: "USD (US Dollar)" }), _jsx("option", { value: "EUR", children: "EUR (Euro)" })] })] })] }), _jsx("button", { type: "submit", disabled: form.isSubmitting, className: "w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50", children: form.isSubmitting ? 'Creating...' : 'Create Cycle' })] })] }));
}
