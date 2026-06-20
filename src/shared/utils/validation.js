// shared/utils/validation.ts
export const ValidationRules = {
    email: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) ? undefined : 'Invalid email address';
    },
    password: (password) => {
        if (password.length < 8)
            return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(password))
            return 'Password must contain uppercase letter';
        if (!/[0-9]/.test(password))
            return 'Password must contain number';
        return undefined;
    },
    required: (value) => {
        return value ? undefined : 'This field is required';
    },
    minLength: (value, min) => {
        return value.length >= min ? undefined : `Minimum ${min} characters required`;
    },
    maxLength: (value, max) => {
        return value.length <= max ? undefined : `Maximum ${max} characters allowed`;
    },
    number: (value) => {
        return /^-?\d+(\.\d+)?$/.test(value) ? undefined : 'Must be a valid number';
    },
    positive: (value) => {
        return value > 0 ? undefined : 'Must be greater than zero';
    },
    futureDate: (date) => {
        return date > new Date() ? undefined : 'Date must be in the future';
    },
    percentage: (value) => {
        if (value < 0 || value > 100)
            return 'Percentage must be between 0 and 100';
        return undefined;
    },
};
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
export function validatePercentageSum(percentages, expectedSum = 100) {
    const sum = percentages.reduce((acc, p) => acc + p, 0);
    return Math.abs(sum - expectedSum) < 0.01;
}
