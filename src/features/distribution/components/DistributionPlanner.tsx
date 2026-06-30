import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CycleService, Cycle } from '@/features/cycle/services/cycleService'
import { useBuckets } from '../hooks/useBuckets'
import BucketList from './BucketList'

/**
 * DistributionPlanner
 *
 * Cambios en HU #2.4:
 * - BucketList ahora usa Distribution Engine
 * - Todos los cálculos son centralizados
 * - La UI solo renderiza, no calcula
 */
export default function DistributionPlanner() {
  const { id } = useParams<{ id: string }>()
  const [cycle, setCycle] = useState<Cycle | null>(null)
  const [loadingCycle, setLoadingCycle] = useState(true)
  const [cyclError, setCycleError] = useState('')

  const { buckets, loading: loadingBuckets, error: bucketsError } = useBuckets(id)

  useEffect(() => {
    loadCycle()
  }, [id])

  const loadCycle = async () => {
    if (!id) return

    try {
      setLoadingCycle(true)
      const data = await CycleService.getCycleById(id)
      setCycle(data)
      console.log('✅ Cycle loaded:', data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load cycle'
      setCycleError(message)
      console.error('❌ Error:', message)
    } finally {
      setLoadingCycle(false)
    }
  }

  if (loadingCycle) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading cycle...</div>
  }

  if (cyclError) {
    return <div style={{ padding: '2rem' }}>Error: {cyclError}</div>
  }

  if (!cycle) {
    return <div style={{ padding: '2rem' }}>Cycle not found</div>
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
          Distribution Planner
        </h1>
        <p style={{ color: '#666', margin: 0 }}>
          Organize how your income will be distributed across different purposes
        </p>
      </div>

      <div
        style={{
          backgroundColor: '#f9f9f9',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #ddd',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>{cycle.name}</h2>
            <p style={{ color: '#666', margin: 0, fontSize: '0.875rem' }}>
              {new Date(cycle.start_date).toLocaleDateString()} - {new Date(cycle.end_date).toLocaleDateString()}
            </p>
          </div>
          <div
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dbeafe',
              color: '#0369a1',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '0.875rem',
            }}
          >
            🔵 {cycle.status}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <p style={{ color: '#666', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>Income Amount</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
              {cycle.currency} {cycle.income.toLocaleString()}
            </p>
          </div>

          <div>
            <p style={{ color: '#666', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>Currency</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{cycle.currency}</p>
          </div>

          <div>
            <p style={{ color: '#666', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>Cycle Days</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
              {Math.floor(
                (new Date(cycle.end_date).getTime() - new Date(cycle.start_date).getTime()) / (1000 * 60 * 60 * 24)
              )}{' '}
              days
            </p>
          </div>
        </div>
      </div>

      {/* BucketList usa Distribution Engine internamente */}
      <BucketList
        buckets={buckets}
        currency={cycle.currency}
        income={cycle.income}
        loading={loadingBuckets}
        error={bucketsError}
      />

      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bfdbfe',
          borderRadius: '6px',
          color: '#0369a1',
          fontSize: '0.875rem',
        }}
      >
        <p style={{ margin: 0 }}>
          <strong>💡 Distribution Engine:</strong> All calculations are performed centrally. The engine handles all financial
          logic for distribution, budget advisor, and future features.
        </p>
      </div>
    </div>
  )
}