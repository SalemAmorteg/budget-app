import { useState, useEffect } from 'react'
import type { Bucket } from '@/shared/types/bucket.types'
import type { DistributionSummary } from '@/shared/types/distribution.types'
import type { LocalBucket } from '../utils/bucketState'
import { toLocalBuckets, updateBucketsPercentage } from '../utils/bucketState'
import { calculateDistribution } from '@/shared/utils/distributionEngine'
import BucketCard from './BucketCard'

interface BucketListProps {
  buckets: Bucket[]
  currency: string
  income: number
  loading: boolean
  error: string | null
}

/**
 * BucketList - Actualizado con Distribution Engine
 *
 * Cambios en HU #2.4:
 * - Usa Distribution Engine para todos los cálculos
 * - Muestra estado de distribución (incompleta, completa, sobreasignada)
 * - Colores dinámicos basados en estado real
 * - No calcula manualmente
 */
export default function BucketList({
  buckets,
  currency,
  income,
  loading,
  error,
}: BucketListProps) {
  // Estado local de buckets (editable)
  const [localBuckets, setLocalBuckets] = useState<LocalBucket[]>([])

  // Resumen calculado por el Distribution Engine
  const [distributionSummary, setDistributionSummary] = useState<DistributionSummary | null>(null)

  // Inicializar estado local cuando se cargan los buckets
  useEffect(() => {
    if (buckets.length > 0) {
      setLocalBuckets(toLocalBuckets(buckets))
    }
  }, [buckets])

  // Calcular distribución cada vez que cambian los buckets locales
  useEffect(() => {
    if (localBuckets.length > 0) {
      const summary = calculateDistribution({ income, buckets: localBuckets })
      setDistributionSummary(summary)
    }
  }, [localBuckets, income])

  // Handler para cambios de porcentaje
  const handlePercentageChange = (bucketId: string, newPercentage: number) => {
    const updated = updateBucketsPercentage(
      localBuckets,
      bucketId,
      newPercentage,
      income
    )
    setLocalBuckets(updated)
  }

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        }}
      >
        <p style={{ color: '#6b7280', margin: 0 }}>
          ⏳ Loading buckets...
        </p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626',
        }}
      >
        <strong>Error loading buckets:</strong> {error}
      </div>
    )
  }

  // Empty state
  if (localBuckets.length === 0) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px dashed #d1d5db',
        }}
      >
        <p style={{ color: '#6b7280', margin: 0 }}>
          📦 No buckets found for this cycle
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginTop: '2rem',
          marginBottom: '1.5rem',
          color: '#111827',
        }}
      >
        Distribution Buckets
      </h2>

      {/* Summary Info - CALCULADO POR DISTRIBUTION ENGINE */}
      {distributionSummary && (
        <>
          {/* Estado de la distribución */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: `${distributionSummary.stateColor}15`,
              border: `2px solid ${distributionSummary.stateColor}`,
              borderRadius: '8px',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: distributionSummary.stateColor, fontSize: '1.25rem' }}>
                {distributionSummary.stateLabel}
              </h3>
              <p style={{ margin: 0, color: distributionSummary.stateColor, fontSize: '1.5rem', fontWeight: 'bold' }}>
                {distributionSummary.isBalanced
                  ? '100%'
                  : distributionSummary.isOverAllocated
                    ? `+${distributionSummary.totalPercentage - 100}%`
                    : `${distributionSummary.remainingPercentage}%`}
              </p>
            </div>
          </div>

          {/* Métricas */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '6px' }}>
              <p style={{ fontSize: '0.875rem', color: '#0369a1', margin: 0 }}>
                Total Buckets
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0369a1', margin: '0.25rem 0 0 0' }}>
                {localBuckets.length}
              </p>
            </div>

            <div
              style={{
                backgroundColor: `${distributionSummary.stateColor}15`,
                padding: '1rem',
                borderRadius: '6px',
                borderLeft: `4px solid ${distributionSummary.stateColor}`,
              }}
            >
              <p style={{ fontSize: '0.875rem', color: distributionSummary.stateColor, margin: 0 }}>
                Total Allocated
              </p>
              <p
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: distributionSummary.stateColor,
                  margin: '0.25rem 0 0 0',
                }}
              >
                {distributionSummary.totalPercentage.toFixed(1)}%
              </p>
            </div>

            <div style={{ backgroundColor: '#fef3c7', padding: '1rem', borderRadius: '6px' }}>
              <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                Amount Allocated
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#92400e', margin: '0.25rem 0 0 0' }}>
                {currency} {distributionSummary.allocatedAmount.toLocaleString()}
              </p>
            </div>

            {!distributionSummary.isBalanced && (
              <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '6px' }}>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  {distributionSummary.isOverAllocated ? 'Over Allocated' : 'Remaining'}
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                  {distributionSummary.isOverAllocated
                    ? `+${currency} ${(distributionSummary.allocatedAmount - income).toLocaleString()}`
                    : `${currency} ${distributionSummary.remainingAmount.toLocaleString()}`}
                </p>
              </div>
            )}
          </div>

          {/* Info Box basado en estado */}
          {distributionSummary.isUnderAllocated && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#fef3c7',
                border: '1px solid #fcd34d',
                borderRadius: '6px',
                marginBottom: '1.5rem',
                color: '#92400e',
                fontSize: '0.875rem',
              }}
            >
              <strong>💡 Remaining:</strong> You still have {distributionSummary.remainingPercentage.toFixed(1)}% ({currency}{' '}
              {distributionSummary.remainingAmount.toLocaleString()}) to distribute
            </div>
          )}

          {distributionSummary.isOverAllocated && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                marginBottom: '1.5rem',
                color: '#dc2626',
                fontSize: '0.875rem',
              }}
            >
              <strong>⚠️ Over allocated:</strong> You've assigned {(distributionSummary.totalPercentage - 100).toFixed(1)}% more
              than your income ({currency} {Math.abs(distributionSummary.allocatedAmount - income).toLocaleString()})
            </div>
          )}

          {distributionSummary.isBalanced && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#ecfdf5',
                border: '1px solid #d1fae5',
                borderRadius: '6px',
                marginBottom: '1.5rem',
                color: '#065f46',
                fontSize: '0.875rem',
              }}
            >
              <strong>✅ Perfect!</strong> Your income is perfectly distributed across all buckets
            </div>
          )}
        </>
      )}

      {/* Buckets Grid */}
      <div>
        {localBuckets.map((bucket) => (
          <BucketCard
            key={bucket.id}
            bucket={bucket}
            currency={currency}
            onPercentageChange={handlePercentageChange}
          />
        ))}
      </div>

      {/* Help Text */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#ecfdf5',
          border: '1px solid #d1fae5',
          borderRadius: '6px',
          color: '#065f46',
          fontSize: '0.875rem',
        }}
      >
        <p style={{ margin: 0 }}>
          <strong>ℹ️ Distribution Engine Active:</strong> All calculations are performed by the Distribution Engine. You can
          explore different distribution scenarios freely.
        </p>
      </div>
    </div>
  )
}