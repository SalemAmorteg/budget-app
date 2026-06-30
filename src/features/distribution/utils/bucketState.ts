import type { Bucket } from '@/shared/types/bucket.types'
import { calculateAllocatedAmount } from '@/shared/utils/bucketCalculations'

/**
 * Versión local editable de un Bucket
 * Utilizada durante la edición de distribución
 */
export interface LocalBucket extends Bucket {
  // percentage y allocatedAmount son editables y calculados localmente
}

/**
 * Actualizar el porcentaje de un bucket y recalcular el monto asignado
 * 
 * @param bucket - Bucket a actualizar
 * @param newPercentage - Nuevo porcentaje
 * @param income - Ingreso total para recalcular monto asignado
 * @returns Bucket actualizado
 */
export function updateBucketPercentage(
  bucket: LocalBucket,
  newPercentage: number,
  income: number
): LocalBucket {
  // Validar que percentage esté entre 0 y 100
  const validPercentage = Math.max(0, Math.min(100, newPercentage))
  
  // Recalcular monto asignado
  const newAllocatedAmount = calculateAllocatedAmount(income, validPercentage)
  
  return {
    ...bucket,
    percentage: validPercentage,
    allocatedAmount: newAllocatedAmount,
  }
}

/**
 * Actualizar múltiples buckets con nuevos porcentajes
 * 
 * @param buckets - Array de buckets
 * @param bucketId - ID del bucket a actualizar
 * @param newPercentage - Nuevo porcentaje
 * @param income - Ingreso total
 * @returns Array de buckets actualizado
 */
export function updateBucketsPercentage(
  buckets: LocalBucket[],
  bucketId: string,
  newPercentage: number,
  income: number
): LocalBucket[] {
  return buckets.map((bucket) => {
    if (bucket.id === bucketId) {
      return updateBucketPercentage(bucket, newPercentage, income)
    }
    return bucket
  })
}

/**
 * Convertir Buckets a LocalBuckets (son lo mismo, pero tipado diferente)
 * 
 * @param buckets - Array de buckets
 * @returns Array de local buckets
 */
export function toLocalBuckets(buckets: Bucket[]): LocalBucket[] {
  return buckets as LocalBucket[]
}