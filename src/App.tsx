import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/store/authStore'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import HomePage from '@/pages/Home'
import LoginPage from '@/features/auth/components/Login'
import SignUpPage from '@/features/auth/components/SignUp'
import CycleForm from '@/features/cycle/components/CycleForm'
import CycleList from '@/features/cycle/components/CycleList'

export default function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<CycleList />} />  {/* ← CAMBIO */}
            <Route path="/cycles" element={<CycleList />} />
            <Route path="/cycles/new" element={<CycleForm />} />
            <Route path="/cycles/:id/distribute" element={<div>Distribution Planner (Coming Soon)</div>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}