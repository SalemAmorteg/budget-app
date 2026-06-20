import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useReducer, useEffect } from 'react';
const AuthContext = createContext(undefined);
function authReducer(state, action) {
    switch (action.type) {
        case 'AUTH_START':
            return { ...state, loading: true, error: null };
        case 'AUTH_SUCCESS':
            return { user: action.payload, loading: false, error: null };
        case 'AUTH_ERROR':
            return { ...state, loading: false, error: action.payload };
        case 'LOGOUT':
            return { user: null, loading: false, error: null };
        default:
            return state;
    }
}
export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        loading: true,
        error: null,
    });
    useEffect(() => {
        // Check localStorage for demo purposes
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                dispatch({ type: 'AUTH_SUCCESS', payload: user });
            }
            catch {
                dispatch({ type: 'LOGOUT' });
            }
        }
        else {
            dispatch({ type: 'LOGOUT' });
        }
    }, []);
    const login = async (email, password) => {
        dispatch({ type: 'AUTH_START' });
        try {
            // TODO: Call actual auth service when Supabase is configured
            const user = {
                id: '1',
                email,
                name: email.split('@')[0],
            };
            localStorage.setItem('user', JSON.stringify(user));
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
        }
        catch (error) {
            dispatch({
                type: 'AUTH_ERROR',
                payload: error instanceof Error ? error.message : 'Login failed',
            });
            throw error;
        }
    };
    const signup = async (email, password, name) => {
        dispatch({ type: 'AUTH_START' });
        try {
            // TODO: Call actual auth service when Supabase is configured
            const user = {
                id: '1',
                email,
                name,
            };
            localStorage.setItem('user', JSON.stringify(user));
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
        }
        catch (error) {
            dispatch({
                type: 'AUTH_ERROR',
                payload: error instanceof Error ? error.message : 'Sign up failed',
            });
            throw error;
        }
    };
    const logout = async () => {
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
    };
    return (_jsx(AuthContext.Provider, { value: { ...state, login, signup, logout }, children: children }));
}
export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
}
