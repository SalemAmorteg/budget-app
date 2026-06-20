import { Link } from 'react-router-dom'
import { useAuth } from '@shared/hooks/useAuth'

export default function Home() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-16">
          <h1 className="text-4xl font-bold text-white">Budget Cycle</h1>
          <div className="space-x-4">
            {user ? (
              <>
                <span className="text-white">Hola, {user.name}</span>
                <button
                  onClick={logout}
                  className="btn-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center text-white mb-16">
          <h2 className="text-5xl font-bold mb-6">
            Take Control of Your Finances
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Distribute your income consciously with Budget Cycle.
            Plan every peso with purpose.
          </p>

          {!user && (
            <div className="space-x-4">
              <Link to="/signup" className="btn-primary inline-block">
                Get Started Free
              </Link>
              <Link to="/login" className="btn-secondary inline-block">
                Already have account?
              </Link>
            </div>
          )}

          {user && (
            <Link to="/dashboard" className="btn-primary inline-block">
              Go to Dashboard
            </Link>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          <div className="card bg-white bg-opacity-10 backdrop-blur">
            <h3 className="text-2xl font-bold mb-4">📊 Plan Income</h3>
            <p>Create cycles for each income and plan ahead with clarity.</p>
          </div>

          <div className="card bg-white bg-opacity-10 backdrop-blur">
            <h3 className="text-2xl font-bold mb-4">💰 Distribute Smartly</h3>
            <p>Allocate 100% of your income across different buckets.</p>
          </div>

          <div className="card bg-white bg-opacity-10 backdrop-blur">
            <h3 className="text-2xl font-bold mb-4">🎯 Track Goals</h3>
            <p>Use Snowballs to save for specific goals over time.</p>
          </div>
        </div>
      </div>
    </div>
  )
}