import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'
import { CycleService } from '@/shared/services/cycleService'

export default function CycleForm() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    income: '',
    currency: 'COP',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.startDate || !formData.endDate || !formData.income) {
      setError('All fields are required')
      return
    }

    if (!user) {
      setError('You must be logged in')
      return
    }

    try {
      setError('')
      setLoading(true)

      const cycle = await CycleService.createCycle(user.id, {
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        income: parseFloat(formData.income),
        currency: formData.currency,
      })

      console.log('✅ Cycle created:', cycle)
      navigate(`/cycles/${cycle.id}/distribute`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create cycle'
      setError(message)
      console.error('❌ Create cycle error:', message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Create New Cycle</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', padding: '1rem', backgroundColor: '#ffe0e0', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Cycle Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., June Salary"
            className="form-input"
            disabled={loading}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            />
          </div>

          <div>
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label>Income</label>
            <input
              type="number"
              name="income"
              value={formData.income}
              onChange={handleChange}
              placeholder="0"
              step="0.01"
              min="0"
              className="form-input"
              disabled={loading}
            />
          </div>

          <div>
            <label>Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            >
              <option value="COP">COP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ padding: '0.75rem', fontSize: '1rem' }}
        >
          {loading ? 'Creating...' : 'Create Cycle'}
        </button>
      </form>
    </div>
  )
}