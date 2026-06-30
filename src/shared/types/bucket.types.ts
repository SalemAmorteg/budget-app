/**
 * Tipos para la entidad Bucket
 * Bucket representa el propósito del dinero dentro de un Cycle
 */

// ========== ENUMS ==========

/**
 * Tipo de bucket
 * DEFAULT: Creado automáticamente con el ciclo
 * CUSTOM: Creado manualmente por el usuario
 */
export enum BucketType {
  DEFAULT = 'DEFAULT',
  CUSTOM = 'CUSTOM',
}

/**
 * Categorías de buckets por defecto
 * Se crean automáticamente cuando se crea un Cycle
 */
export enum DefaultBucketName {
  NECESSITIES = 'Necesidades',
  STABILITY = 'Estabilidad',
  INVESTMENT = 'Inversión',
  REWARDS = 'Recompensas',
  DEBTS = 'Deudas',
}

// ========== INTERFACES ==========

/**
 * Bucket: Representa un propósito de dinero dentro de un Cycle
 */
export interface Bucket {
  id: string
  cycleId: string
  name: string
  percentage: number
  allocatedAmount: number
  type: BucketType
  color?: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Input para crear un Bucket
 */
export interface CreateBucketInput {
  cycleId: string
  name: string
  percentage?: number
  type?: BucketType
  color?: string
  isDefault?: boolean
}

/**
 * Input para actualizar un Bucket
 */
export interface UpdateBucketInput {
  name?: string
  percentage?: number
  color?: string
}

/**
 * Respuesta del servicio
 */
export interface BucketResponse {
  success: boolean
  data?: Bucket
  error?: string
}

/**
 * Configuración de los buckets por defecto
 */
export interface DefaultBucketConfig {
  name: DefaultBucketName
  percentage: number
  color: string
}

/**
 * Mapeo de buckets por defecto con sus configuraciones iniciales
 */
export const DEFAULT_BUCKETS_CONFIG: Record<DefaultBucketName, DefaultBucketConfig> = {
  [DefaultBucketName.NECESSITIES]: {
    name: DefaultBucketName.NECESSITIES,
    percentage: 40,
    color: '#ef4444', // red
  },
  [DefaultBucketName.STABILITY]: {
    name: DefaultBucketName.STABILITY,
    percentage: 15,
    color: '#f59e0b', // amber
  },
  [DefaultBucketName.INVESTMENT]: {
    name: DefaultBucketName.INVESTMENT,
    percentage: 25,
    color: '#10b981', // emerald
  },
  [DefaultBucketName.REWARDS]: {
    name: DefaultBucketName.REWARDS,
    percentage: 10,
    color: '#8b5cf6', // violet
  },
  [DefaultBucketName.DEBTS]: {
    name: DefaultBucketName.DEBTS,
    percentage: 10,
    color: '#3b82f6', // blue
  },
}