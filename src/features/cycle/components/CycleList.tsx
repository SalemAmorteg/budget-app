import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'
import { CycleService, Cycle } from '@/shared/services/cycleService'

export default function CycleList() {
  const { user } = useAuth()
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCycles()
  }, [user?.id])

  const loadCycles = async () => {
    if (!user) return

    try {
      setLoading(true)
      const data = await CycleService.getUserCycles(user.id)
      setCycles(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cycles')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading cycles...</div>

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>My Cycles</h1>
        <Link to="/cycles/new" className="btn-primary">
          + New Cycle
        </Link>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', padding: '1rem', backgroundColor: '#ffe0e0' }}>
          {error}
        </div>
      )}

      {cycles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          <p>No cycles yet. Create your first one!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {cycles.map((cycle) => (
            <Link
              key={cycle.id}
              to={`/cycles/${cycle.id}/distribute`}
              style={{
                textDecoration: 'none',
                padding: '1.5rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <h3>{cycle.name}</h3>
              <p style={{ color: '#666', margin: '0.5rem 0' }}>
                Income: {cycle.currency} {cycle.income.toLocaleString()}
              </p>
              <p style={{ color: '#999', fontSize: '0.875rem' }}>
                {new Date(cycle.start_date).toLocaleDateString()} - {new Date(cycle.end_date).toLocaleDateString()}
              </p>
              <span style={{ display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#0284c7', color: 'white', borderRadius: '4px', fontSize: '0.875rem' }}>
                Distribute →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}