// shared/utils/constants.ts
export const APP_CONSTANTS = {
  CYCLE_STATUS: {
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    PENDING: 'PENDING',
  },
  SNOWBALL_STATUS: {
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    PAUSED: 'PAUSED',
  },
  BUCKET_CATEGORIES: {
    NECESSITIES: 'Necesidades',
    STABILITY: 'Estabilidad',
    INVESTMENT: 'Inversión',
    REWARDS: 'Recompensas',
    DEBTS: 'Deudas',
    CUSTOM: 'Personalizado',
  },
  CURRENCIES: ['COP', 'USD', 'EUR'],
  MAX_BUDGET_PROFILES: 3,
  DEFAULT_LOCALE: 'es-CO',
} as const;

export const DEFAULT_BUCKET_ALLOCATIONS = {
  CONSERVATIVE: {
    Necesidades: 50,
    Estabilidad: 25,
    Inversión: 10,
    Recompensas: 5,
    Deudas: 10,
  },
  MODERATE: {
    Necesidades: 45,
    Estabilidad: 15,
    Inversión: 20,
    Recompensas: 10,
    Deudas: 10,
  },
  AGGRESSIVE: {
    Necesidades: 40,
    Estabilidad: 10,
    Inversión: 35,
    Recompensas: 5,
    Deudas: 10,
  },
} as const;