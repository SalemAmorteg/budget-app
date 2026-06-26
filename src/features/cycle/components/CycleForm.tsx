import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'
import { CycleService, CreateCycleInput } from '@/features/cycle/services/cycleService'

interface FormErrors {
  name?: string
  startDate?: string
  endDate?: string
  income?: string
}

export default function CycleForm() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    income: '',
    currency: 'COP' as const,
  })

  // Estado de UI
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [apiError, setApiError] = useState('')

  // ========== VALIDACIÓN ==========
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'Cycle name is required'
    }
    if (formData.name.length < 3) {
      newErrors.name = 'Cycle name must be at least 3 characters'
    }
    if (formData.name.length > 50) {
      newErrors.name = 'Cycle name must be less than 50 characters'
    }

    // Validar fechas
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)

      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date'
      }

      const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      if (daysDiff < 7) {
        newErrors.endDate = 'Cycle must be at least 7 days long'
      }
      if (daysDiff > 365) {
        newErrors.endDate = 'Cycle must be less than 365 days'
      }
    }

    // Validar ingreso
    if (!formData.income) {
      newErrors.income = 'Income is required'
    }
    const incomeNum = parseFloat(formData.income)
    if (isNaN(incomeNum) || incomeNum <= 0) {
      newErrors.income = 'Income must be a positive number'
    }
    if (incomeNum > 999999999) {
      newErrors.income = 'Income is too large'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ========== HANDLERS ==========
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    // 1. Validar formulario
    if (!validateForm()) {
      console.log('❌ Form validation failed')
      return
    }

    // 2. Validar que usuario está logueado
    if (!user) {
      setApiError('You must be logged in')
      return
    }

    try {
      setLoading(true)
      console.log('📝 Creating cycle with data:', formData)

      // 3. Llamar al servicio
      const input: CreateCycleInput = {
        name: formData.name.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        income: parseFloat(formData.income),
        currency: formData.currency,
      }

      const cycle = await CycleService.createCycle(user.id, input)

      console.log('✅ Cycle created successfully:', cycle)
      
      // 4. Redirigir al Distribution Planner
      // Simulamos que el usuario debe distribuir el ingreso
      navigate(`/cycles/${cycle.id}/distribute`, {
        state: { cycle },
        replace: true,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create cycle'
      console.error('❌ Create cycle error:', message)
      setApiError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '700px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Create New Income Cycle
        </h1>
        <p style={{ color: '#666' }}>
          Define your income period and amount to start distributing your money wisely
        </p>
      </div>

      {/* API Error */}
      {apiError && (
        <div
          style={{
            color: '#dc2626',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
          }}
        >
          <strong>Error:</strong> {apiError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Cycle Name */}
        <div>
          <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
            Cycle Name
            <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., June Salary, Freelance Payment"
            className="form-input"
            disabled={loading}
            maxLength={50}
            style={{
              borderColor: errors.name ? '#dc2626' : undefined,
            }}
          />
          {errors.name && (
            <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.name}
            </p>
          )}
          <p style={{ color: '#999', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            {formData.name.length}/50 characters
          </p>
        </div>

        {/* Dates Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Start Date */}
          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
              Start Date
              <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
              style={{
                borderColor: errors.startDate ? '#dc2626' : undefined,
              }}
            />
            {errors.startDate && (
              <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.startDate}
              </p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
              End Date
              <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
              style={{
                borderColor: errors.endDate ? '#dc2626' : undefined,
              }}
            />
            {errors.endDate && (
              <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.endDate}
              </p>
            )}
          </div>
        </div>

        {/* Income & Currency Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Income */}
          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
              Income Amount
              <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="number"
              name="income"
              value={formData.income}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="form-input"
              disabled={loading}
              style={{
                borderColor: errors.income ? '#dc2626' : undefined,
              }}
            />
            {errors.income && (
              <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.income}
              </p>
            )}
          </div>

          {/* Currency */}
          <div>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
              Currency
              <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            >
              <option value="COP">COP - Colombian Peso</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>
        </div>

        {/* Summary */}
        {formData.income && !errors.income && (
          <div
            style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #d1fae5',
              padding: '1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
            }}
          >
            <p style={{ color: '#065f46', fontWeight: '500' }}>
              💰 You'll distribute {formData.currency} {parseFloat(formData.income).toLocaleString()}
            </p>
            <p style={{ color: '#047857', marginTop: '0.25rem', fontSize: '0.75rem' }}>
              This will be split across your distribution buckets
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{
            padding: '0.875rem',
            fontSize: '1rem',
            fontWeight: '600',
            marginTop: '1rem',
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '⏳ Creating Cycle...' : '✨ Create Cycle & Start Distribution'}
        </button>
      </form>

      {/* Help Text */}
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '6px' }}>
        <p style={{ fontSize: '0.875rem', color: '#0369a1', marginBottom: '0.5rem' }}>
          <strong>💡 What happens next?</strong>
        </p>
        <ul style={{ fontSize: '0.875rem', color: '#0369a1', paddingLeft: '1.5rem', margin: 0 }}>
          <li>Your cycle becomes ACTIVE</li>
          <li>Previous active cycles are marked as COMPLETED</li>
          <li>You'll be guided to distribute your income</li>
          <li>Each peso will be assigned to a bucket</li>
        </ul>
      </div>
    </div>
  )
}