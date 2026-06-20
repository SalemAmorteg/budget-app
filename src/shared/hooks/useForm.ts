// shared/hooks/useForm.ts
import { useState, useCallback } from 'react';

interface UseFormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void> | void,
  validate?: (values: T) => Partial<Record<keyof T, string>>
) {
  const [state, setState] = useState<UseFormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

      setState(prev => ({
        ...prev,
        values: { ...prev.values, [name]: fieldValue },
      }));
    },
    []
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [name]: true },
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate
      let errors: Partial<Record<keyof T, string>> = {};
      if (validate) {
        errors = validate(state.values);
      }

      setState(prev => ({ ...prev, errors }));

      if (Object.keys(errors).length === 0) {
        setState(prev => ({ ...prev, isSubmitting: true }));
        try {
          await onSubmit(state.values);
        } finally {
          setState(prev => ({ ...prev, isSubmitting: false }));
        }
      }
    },
    [state.values, validate, onSubmit]
  );

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
    setFieldValue: (field: keyof T, value: any) => {
      setState(prev => ({
        ...prev,
        values: { ...prev.values, [field]: value },
      }));
    },
  };
}