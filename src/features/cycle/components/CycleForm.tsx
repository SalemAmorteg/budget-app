// features/cycle/components/CycleForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';
import { useForm } from '@shared/hooks/useForm';
import { CycleService } from '../services/cycleService';
import { ValidationRules } from '@shared/utils/validation';
import { formatDate } from '@shared/utils/dateFormat';

export default function CycleForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [apiError, setApiError] = useState('');

  const form = useForm(
    {
      name: '',
      startDate: formatDate(new Date(), 'yyyy-MM-dd'),
      endDate: '',
      income: '',
      currency: 'COP',
    },
    async (values) => {
      try {
        if (!user) return;
        setApiError('');

        const cycle = await CycleService.createCycle(user.id, {
          name: values.name,
          startDate: new Date(values.startDate),
          endDate: new Date(values.endDate),
          income: parseFloat(values.income),
          currency: values.currency,
        });

        navigate(`/cycle/${cycle.id}/distribute`);
      } catch (error) {
        setApiError(error instanceof Error ? error.message : 'Failed to create cycle');
      }
    },
    (values) => {
      const errors: Record<string, string> = {};

      if (!values.name) errors.name = 'Cycle name is required';
      if (!values.startDate) errors.startDate = 'Start date is required';
      if (!values.endDate) errors.endDate = 'End date is required';
      if (!values.income) errors.income = 'Income is required';

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
    }
  );

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Create New Cycle</h1>

      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded px-4 py-3 mb-6 text-red-700">
          {apiError}
        </div>
      )}

      <form onSubmit={form.handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cycle Name
          </label>
          <input
            type="text"
            name="name"
            value={form.values.name}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            placeholder="e.g., June Salary"
            className={`w-full px-3 py-2 border rounded-lg ${
              form.touched.name && form.errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {form.touched.name && form.errors.name && (
            <p className="text-red-500 text-xs mt-1">{form.errors.name}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={form.values.startDate}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              className={`w-full px-3 py-2 border rounded-lg ${
                form.touched.startDate && form.errors.startDate
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {form.touched.startDate && form.errors.startDate && (
              <p className="text-red-500 text-xs mt-1">{form.errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={form.values.endDate}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              className={`w-full px-3 py-2 border rounded-lg ${
                form.touched.endDate && form.errors.endDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {form.touched.endDate && form.errors.endDate && (
              <p className="text-red-500 text-xs mt-1">{form.errors.endDate}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Income
            </label>
            <input
              type="number"
              name="income"
              value={form.values.income}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              placeholder="0"
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-lg ${
                form.touched.income && form.errors.income ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {form.touched.income && form.errors.income && (
              <p className="text-red-500 text-xs mt-1">{form.errors.income}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              name="currency"
              value={form.values.currency}
              onChange={form.handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="COP">COP (Colombian Peso)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={form.isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {form.isSubmitting ? 'Creating...' : 'Create Cycle'}
        </button>
      </form>
    </div>
  );
}