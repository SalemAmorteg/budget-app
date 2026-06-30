import type { LocalBucket } from '../utils/bucketState'
import { parsePercentageInput, clampPercentage } from '@/shared/utils/bucketCalculations'

interface BucketCardProps {
  bucket: LocalBucket
  currency: string
  onPercentageChange: (bucketId: string, newPercentage: number) => void
}

/**
 * BucketCard: Tarjeta de bucket editable
 * 
 * Cambios en HU #2.3:
 * - Input numérico para editar percentage
 * - Handler onPercentageChange para notificar cambios
 * - Muestra allocatedAmount calculado localmente
 * 
 * No contiene lógica de cálculo (eso está en utils)
 */
export default function BucketCard({
  bucket,
  currency,
  onPercentageChange,
}: BucketCardProps) {
  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value

    // Si el campo está vacío, permitir escribir "0"
    if (rawValue === '') {
      onPercentageChange(bucket.id, 0)
      return
    }

    // Parsear y validar el input
    const newPercentage = parsePercentageInput(rawValue)
    onPercentageChange(bucket.id, newPercentage)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Al perder el foco, asegurar que el valor sea válido
    const value = clampPercentage(parseFloat(e.target.value) || 0)
    onPercentageChange(bucket.id, value)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1.25rem',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        marginBottom: '1rem',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Color indicator */}
      {bucket.color && (
        <div
          style={{
            width: '4px',
            height: '60px',
            backgroundColor: bucket.color,
            borderRadius: '2px',
            marginRight: '1rem',
          }}
        />
      )}

      {/* Content */}
      <div style={{ flex: 1 }}>
        {/* Name */}
        <h3
          style={{
            margin: 0,
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '0.5rem',
          }}
        >
          {bucket.name}
        </h3>

        {/* Percentage Input and Amount */}
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center',
          }}
        >
          {/* Percentage Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={bucket.percentage}
              onChange={handlePercentageChange}
              onBlur={handleBlur}
              placeholder="0"
              style={{
                color: '#6b7280',
                width: '70px',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: '600',
                textAlign: 'right',
              }}
            />
            <span style={{ color: '#6b7280', fontWeight: '500' }}>%</span>
          </div>

          {/* Allocated Amount */}
          <div
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px',
              fontSize: '0.875rem',
              color: '#374151',
            }}
          >
            <span style={{ fontWeight: '600' }}>
              {currency} {bucket.allocatedAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Badge for default buckets */}
      {bucket.isDefault && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.25rem 0.75rem',
            backgroundColor: '#f0f9ff',
            border: '1px solid #bfdbfe',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#0369a1',
            marginLeft: '1rem',
          }}
        >
          Default
        </div>
      )}
    </div>
  )
}