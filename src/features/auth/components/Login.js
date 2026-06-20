import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';
export default function Login() {
    const navigate = useNavigate();
    const { login, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            await login(email, password);
            navigate('/dashboard');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl p-8 w-full max-w-md", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Budget Cycle" }), _jsx("p", { className: "text-gray-600 mb-8", children: "Take control of your finances" }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded px-4 py-3 mb-6 text-red-700 text-sm", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "your@email.com", className: "form-input", required: true, disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "form-input", required: true, disabled: loading })] }), _jsx("button", { type: "submit", disabled: loading, className: "btn-primary w-full", children: loading ? 'Logging in...' : 'Login' })] }), _jsxs("p", { className: "text-center text-gray-600 text-sm mt-6", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/signup", className: "text-blue-600 hover:underline font-semibold", children: "Sign up" })] })] }) }));
}
