import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';
export default function SignUp() {
    const navigate = useNavigate();
    const { signup, loading } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            await signup(formData.email, formData.password, formData.name);
            navigate('/dashboard');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Sign up failed');
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl p-8 w-full max-w-md", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Budget Cycle" }), _jsx("p", { className: "text-gray-600 mb-8", children: "Create your account" }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded px-4 py-3 mb-6 text-red-700 text-sm", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Name" }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleChange, placeholder: "Your name", className: "form-input", required: true, disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Email" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, placeholder: "your@email.com", className: "form-input", required: true, disabled: loading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Password" }), _jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleChange, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "form-input", required: true, disabled: loading })] }), _jsx("button", { type: "submit", disabled: loading, className: "btn-primary w-full", children: loading ? 'Creating account...' : 'Sign Up' })] }), _jsxs("p", { className: "text-center text-gray-600 text-sm mt-6", children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "text-blue-600 hover:underline font-semibold", children: "Login" })] })] }) }));
}
