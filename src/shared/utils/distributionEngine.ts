/**
 * Distribution Engine
 * Motor financiero centralizado para calcular y validar la distribución de ingresos
 *
 * Responsabilidades:
 * - Calcular totales de porcentaje y monto
 * - Calcular faltantes
 * - Determinar estado (incompleta, completa, sobreasignada)
 * - Proveedor de verdad única para toda lógica financiera
 *
 * Características:
 * - Función pura (sin efectos secundarios)
 * - Sin dependencias externas (React, Supabase, etc)
 * - Reutilizable por múltiples features
 * - TypeScript estricto
 */

import type { Bucket } from '@/shared/types/bucket.types'
import type {
  DistributionSummary,
  DistributionInput,
  DistributionEngineResult,
} from '@/shared/types/distribution.types'
import { DistributionState, DISTRIBUTION_STATE_LABELS, DISTRIBUTION_STATE_COLORS } from '@/shared/types/distribution.types'

/**
 * Calcular el estado de una distribución
 * Determina si es incompleta, completa o sobreasignada
 *
 * @param totalPercentage - Porcentaje total asignado
 * @returns Estado de la distribución
 */
function calculateDistributionState(totalPercentage: number): DistributionState {
  const tolerance = 0.01 // Permitir pequeños errores de redondeo

  if (Math.abs(totalPercentage - 100) <= tolerance) {
    return DistributionState.BALANCED
  }

  if (totalPercentage > 100) {
    return DistributionState.OVER_ALLOCATED
  }

  return DistributionState.INCOMPLETE
}

/**
 * Distribution Engine - Motor financiero principal
 *
 * Función pura que calcula el estado completo de una distribución.
 *
 * @param input - { income, buckets }
 * @returns DistributionSummary con todos los cálculos
 *
 * @example
 * const summary = calculateDistribution({
 *   income: 5000000,
 *   buckets: [
 *     { id: '1', name: 'Necesidades', percentage: 40, ... },
 *     { id: '2', name: 'Estabilidad', percentage: 15, ... },
 *   ]
 * })
 *
 * // Resultado:
 * // {
 * //   totalPercentage: 55,
 * //   allocatedAmount: 2750000,
 * //   remainingPercentage: 45,
 * //   remainingAmount: 2250000,
 * //   isBalanced: false,
 * //   isOverAllocated: false,
 * //   isUnderAllocated: true,
 * //   state: 'INCOMPLETE',
 * //   ...
 * // }
 */
export function calculateDistribution(input: DistributionInput): DistributionSummary {
  const { income, buckets } = input

  // ========== VALIDACIONES BÁSICAS ==========
  if (income < 0) {
    console.warn('⚠️ Distribution Engine: Income is negative, treating as 0')
  }

  if (!buckets || buckets.length === 0) {
    console.warn('⚠️ Distribution Engine: No buckets provided')
  }

  // ========== CÁLCULOS PRINCIPALES ==========

  // 1. Calcular porcentaje total
  const totalPercentage = buckets.reduce((sum, bucket) => {
    const percentage = isFinite(bucket.percentage) ? bucket.percentage : 0
    return sum + Math.max(0, percentage) // Evitar números negativos
  }, 0)

  // 2. Calcular monto asignado total
  const allocatedAmount = buckets.reduce((sum, bucket) => {
    const allocated = isFinite(bucket.allocatedAmount) ? bucket.allocatedAmount : 0
    return sum + Math.max(0, allocated) // Evitar números negativos
  }, 0)

  // 3. Calcular faltantes
  const remainingPercentage = Math.max(0, 100 - totalPercentage)
  const remainingAmount = Math.max(0, income - allocatedAmount)

  // 4. Determinar estado
  const state = calculateDistributionState(totalPercentage)
  const isBalanced = state === DistributionState.BALANCED
  const isOverAllocated = state === DistributionState.OVER_ALLOCATED
  const isUnderAllocated = state === DistributionState.INCOMPLETE

  // ========== CONSTRUIR RESUMEN ==========
  const summary: DistributionSummary = {
    // Totales
    totalPercentage: Math.round(totalPercentage * 10) / 10, // 1 decimal
    allocatedAmount: Math.round(allocatedAmount * 100) / 100, // 2 decimales

    // Faltantes
    remainingPercentage: Math.round(remainingPercentage * 10) / 10, // 1 decimal
    remainingAmount: Math.round(remainingAmount * 100) / 100, // 2 decimales

    // Estados
    isBalanced,
    isOverAllocated,
    isUnderAllocated,
    state,
    stateLabel: DISTRIBUTION_STATE_LABELS[state],
    stateColor: DISTRIBUTION_STATE_COLORS[state],

    // Debug
    bucketsDebug: buckets.map((bucket) => ({
      id: bucket.id,
      name: bucket.name,
      percentage: bucket.percentage,
      allocatedAmount: bucket.allocatedAmount,
    })),
  }

  console.log('📊 Distribution Engine Result:', summary)
  return summary
}

/**
 * Versión con manejo de errores
 * Útil si se necesita capturar excepciones
 */
export function calculateDistributionSafe(
  input: DistributionInput
): DistributionEngineResult {
  try {
    const summary = calculateDistribution(input)
    return { success: true, summary }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Distribution Engine Error:', errorMessage)
    return {
      success: false,
      summary: {
        totalPercentage: 0,
        allocatedAmount: 0,
        remainingPercentage: 100,
        remainingAmount: input.income,
        isBalanced: false,
        isOverAllocated: false,
        isUnderAllocated: true,
        state: DistributionState.INCOMPLETE,
        stateLabel: '🟡 Error en cálculo',
        stateColor: '#6b7280',
        bucketsDebug: [],
      },
      error: errorMessage,
    }
  }
}

/**
 * Validar si una distribución está equilibrada
 * Útil para pre-validaciones
 */
export function isDistributionValid(input: DistributionInput): boolean {
  const summary = calculateDistribution(input)
  return summary.isBalanced
}

/**
 * Obtener el porcentaje sobreasignado (si existe)
 * Útil para mostrar feedback al usuario
 */
export function getOverAllocationPercentage(input: DistributionInput): number {
  const summary = calculateDistribution(input)
  if (summary.isOverAllocated) {
    return summary.totalPercentage - 100
  }
  return 0
}

/**
 * Obtener el porcentaje faltante (si existe)
 */
export function getUnderAllocationPercentage(input: DistributionInput): number {
  const summary = calculateDistribution(input)
  if (summary.isUnderAllocated) {
    return 100 - summary.totalPercentage
  }
  return 0
}