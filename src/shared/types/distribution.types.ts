/**
 * Tipos para el Distribution Engine
 * Define el contrato de entrada y salida del motor financiero
 */

import type { Bucket } from './bucket.types'

// ========== ENUMS ==========

/**
 * Estados posibles de una distribución
 */
export enum DistributionState {
  INCOMPLETE = 'INCOMPLETE',
  BALANCED = 'BALANCED',
  OVER_ALLOCATED = 'OVER_ALLOCATED',
}

/**
 * Descripción visual del estado
 */
export const DISTRIBUTION_STATE_LABELS: Record<DistributionState, string> = {
  [DistributionState.INCOMPLETE]: '🟡 Falta distribuir',
  [DistributionState.BALANCED]: '🟢 Distribución completa',
  [DistributionState.OVER_ALLOCATED]: '🔴 Has sobreasignado',
}

/**
 * Colores para visualización
 */
export const DISTRIBUTION_STATE_COLORS: Record<DistributionState, string> = {
  [DistributionState.INCOMPLETE]: '#f59e0b', // ámbar
  [DistributionState.BALANCED]: '#10b981', // verde
  [DistributionState.OVER_ALLOCATED]: '#ef4444', // rojo
}

// ========== INTERFACES ==========

/**
 * Entrada del Distribution Engine
 */
export interface DistributionInput {
  /** Ingreso total del ciclo */
  income: number
  /** Buckets con porcentajes asignados */
  buckets: Bucket[]
}

/**
 * Salida del Distribution Engine
 * Resumen completo del estado de la distribución
 */
export interface DistributionSummary {
  // Totales
  /** Porcentaje total asignado (0-∞, puede ser > 100) */
  totalPercentage: number

  /** Monto total asignado en dinero */
  allocatedAmount: number

  // Faltantes
  /** Porcentaje aún sin asignar */
  remainingPercentage: number

  /** Monto aún sin asignar en dinero */
  remainingAmount: number

  // Estados
  /** True si totalPercentage === 100 */
  isBalanced: boolean

  /** True si totalPercentage > 100 */
  isOverAllocated: boolean

  /** True si totalPercentage < 100 */
  isUnderAllocated: boolean

  /** Estado actual de la distribución */
  state: DistributionState

  /** Descripción visual del estado */
  stateLabel: string

  /** Color para visualización */
  stateColor: string

  /** Detalles de cada bucket para debugging */
  bucketsDebug: Array<{
    id: string
    name: string
    percentage: number
    allocatedAmount: number
  }>
}

/**
 * Resultado del Distribution Engine
 */
export interface DistributionEngineResult {
  success: boolean
  summary: DistributionSummary
  error?: string
}