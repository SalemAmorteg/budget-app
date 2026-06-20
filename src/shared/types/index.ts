// shared/types/index.ts

// ========== AUTH DOMAIN ==========
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContext {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  session: Session | null;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  user: User;
}

// ========== CYCLE DOMAIN ==========
export enum CycleStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING'
}

export interface Cycle {
  id: string;
  userId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  income: number;
  currency: 'COP' | 'USD' | 'EUR';
  status: CycleStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCyclePayload {
  name: string;
  startDate: Date;
  endDate: Date;
  income: number;
  currency: string;
}

export interface CycleWithBuckets extends Cycle {
  buckets: Bucket[];
  totalAllocated: number;
  remainingPercentage: number;
}

// ========== BUCKET DOMAIN ==========
export enum BucketCategory {
  NECESSITIES = 'Necesidades',
  STABILITY = 'Estabilidad',
  INVESTMENT = 'Inversión',
  REWARDS = 'Recompensas',
  DEBTS = 'Deudas',
  CUSTOM = 'Personalizado'
}

export interface Bucket {
  id: string;
  cycleId: string;
  name: string;
  category: BucketCategory;
  percentage: number;
  allocatedAmount: number;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBucketPayload {
  cycleId: string;
  name: string;
  category: BucketCategory;
  percentage: number;
}

export interface BucketAllocation {
  bucketId: string;
  percentage: number;
  amount: number;
}

// ========== SNOWBALL DOMAIN ==========
export enum SnowballStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED'
}

export interface Snowball {
  id: string;
  cycleId: string;
  bucketId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  status: SnowballStatus;
  contributions: SnowballContribution[];
  progressPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SnowballContribution {
  id: string;
  snowballId: string;
  amount: number;
  date: Date;
}

export interface CreateSnowballPayload {
  cycleId: string;
  bucketId: string;
  name: string;
  targetAmount: number;
  targetDate: Date;
}

// ========== BUDGET ADVISOR DOMAIN ==========
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface BudgetProfile {
  name: string;
  description: string;
  allocations: {
    [key in BucketCategory]?: number;
  };
}

export enum AdvisorProfileType {
  CONSERVATIVE = 'CONSERVATIVE',
  MODERATE = 'MODERATE',
  AGGRESSIVE = 'AGGRESSIVE'
}

export interface BudgetAdvisorRecommendation {
  profileType: AdvisorProfileType;
  profile: BudgetProfile;
  currentAllocation: Record<BucketCategory, number>;
  differences: Record<BucketCategory, number>;
  riskLevel: RiskLevel;
  riskFactors: string[];
  recommendations: string[];
}

// ========== VALIDATION DOMAIN ==========
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}