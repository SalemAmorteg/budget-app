// features/auth/components/Login.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';
import { useForm } from '@shared/hooks/useForm';
import { ValidationRules } from '@shared/utils/validation';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [apiError, setApiError] = useState('');

  const form = useForm(
    { email: '', password: '' },
    async (values) => {
      try {
        setApiError('');
        await login(values.email, values.password);
        navigate('/dashboard');
      } catch (error) {
        setApiError(error instanceof Error ? error.message : 'Login failed');
      }
    },
    (values) => {
      const errors: Record<string, string> = {};
      
      const emailError = ValidationRules.email(values.email);
      if (emailError) errors.email = emailError;
      
      const passwordError = ValidationRules.required(values.password);
      if (passwordError) errors.password = passwordError;
      
      return errors;
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Cycle</h1>
        <p className="text-gray-600 mb-8">Take control of your finances</p>

        {apiError && (
          <div
            className="bg-red-50 border border-red-200 rounded px-4 py-3 mb-6 text-red-700 text-sm"
            data-testid="error-message"
          >
            {apiError}
          </div>
        )}

        <form onSubmit={form.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.values.email}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              placeholder="your@email.com"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                form.touched.email && form.errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {form.touched.email && form.errors.email && (
              <p className="text-red-500 text-xs mt-1">{form.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.values.password}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              placeholder="••••••••"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                form.touched.password && form.errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {form.touched.password && form.errors.password && (
              <p className="text-red-500 text-xs mt-1">{form.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}