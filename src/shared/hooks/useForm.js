// shared/hooks/useForm.ts
import { useState, useCallback } from 'react';
export function useForm(initialValues, onSubmit, validate) {
    const [state, setState] = useState({
        values: initialValues,
        errors: {},
        touched: {},
        isSubmitting: false,
    });
    const handleChange = useCallback((e) => {
        const { name, value, type } = e.target;
        const fieldValue = type === 'checkbox' ? e.target.checked : value;
        setState(prev => ({
            ...prev,
            values: { ...prev.values, [name]: fieldValue },
        }));
    }, []);
    const handleBlur = useCallback((e) => {
        const { name } = e.target;
        setState(prev => ({
            ...prev,
            touched: { ...prev.touched, [name]: true },
        }));
    }, []);
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        // Validate
        let errors = {};
        if (validate) {
            errors = validate(state.values);
        }
        setState(prev => ({ ...prev, errors }));
        if (Object.keys(errors).length === 0) {
            setState(prev => ({ ...prev, isSubmitting: true }));
            try {
                await onSubmit(state.values);
            }
            finally {
                setState(prev => ({ ...prev, isSubmitting: false }));
            }
        }
    }, [state.values, validate, onSubmit]);
    const resetForm = useCallback(() => {
        setState({
            values: initialValues,
            errors: {},
            touched: {},
            isSubmitting: false,
        });
    }, [initialValues]);
    return {
        values: state.values,
        errors: state.errors,
        touched: state.touched,
        isSubmitting: state.isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
        setFieldValue: (field, value) => {
            setState(prev => ({
                ...prev,
                values: { ...prev.values, [field]: value },
            }));
        },
    };
}
