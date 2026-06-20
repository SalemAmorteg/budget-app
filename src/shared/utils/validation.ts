// shared/utils/validation.ts
export const ValidationRules = {
  email: (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? undefined : 'Invalid email address';
  },

  password: (password: string): string | undefined => {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain uppercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain number';
    return undefined;
  },

  required: (value: string | number): string | undefined => {
    return value ? undefined : 'This field is required';
  },

  minLength: (value: string, min: number): string | undefined => {
    return value.length >= min ? undefined : `Minimum ${min} characters required`;
  },

  maxLength: (value: string, max: number): string | undefined => {
    return value.length <= max ? undefined : `Maximum ${max} characters allowed`;
  },

  number: (value: string): string | undefined => {
    return /^-?\d+(\.\d+)?$/.test(value) ? undefined : 'Must be a valid number';
  },

  positive: (value: number): string | undefined => {
    return value > 0 ? undefined : 'Must be greater than zero';
  },

  futureDate: (date: Date): string | undefined => {
    return date > new Date() ? undefined : 'Date must be in the future';
  },

  percentage: (value: number): string | undefined => {
    if (value < 0 || value > 100) return 'Percentage must be between 0 and 100';
    return undefined;
  },
};

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePercentageSum(percentages: number[], expectedSum = 100): boolean {
  const sum = percentages.reduce((acc, p) => acc + p, 0);
  return Math.abs(sum - expectedSum) < 0.01;
}