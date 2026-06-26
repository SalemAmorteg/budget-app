import { useParams, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CycleService, Cycle } from '@/features/cycle/services/cycleService'

export default function DistributionPlanner() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const [cycle, setCycle] = useState<Cycle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCycle()
  }, [id])

  const loadCycle = async () => {
    if (!id) return

    try {
      setLoading(true)
      const data = await CycleService.getCycleById(id)
      setCycle(data)
      console.log('✅ Cycle loaded:', data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load cycle'
      setError(message)
      console.error('❌ Error:', message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading cycle...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    )
  }

  if (!cycle) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Cycle not found</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Distribution Planner</h1>

      {/* Cycle Summary */}
      <div
        style={{
          backgroundColor: '#f9f9f9',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #ddd',
        }}
      >
        <h2>{cycle.name}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <p style={{ color: '#666', fontSize: '0.875rem' }}>Income</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {cycle.currency} {cycle.income.toLocaleString()}
            </p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '0.875rem' }}>Period</p>
            <p style={{ fontSize: '1rem' }}>
              {new Date(cycle.start_date).toLocaleDateString()} - {new Date(cycle.end_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '0.875rem' }}>Status</p>
            <p style={{ fontSize: '1rem', fontWeight: '600', color: '#059669' }}>
              🔵 {cycle.status}
            </p>
          </div>
        </div>
      </div>

      {/* Placeholder */}
      <div
        style={{
          backgroundColor: '#eff6ff',
          border: '2px dashed #0284c7',
          padding: '3rem',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <h3 style={{ color: '#0284c7', marginBottom: '1rem' }}>📊 Distribution Planner</h3>
        <p style={{ color: '#0369a1', marginBottom: '1rem' }}>
          This is where you'll allocate your income across different buckets.
        </p>
        <p style={{ color: '#0369a1', fontSize: '0.875rem' }}>
          Feature implementation coming in the next sprint ✨
        </p>
      </div>
    </div>
  )
}