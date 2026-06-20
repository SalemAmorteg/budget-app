import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null }
    case 'AUTH_SUCCESS':
      return { user: action.payload, loading: false, error: null }
    case 'AUTH_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'LOGOUT':
      return { user: null, loading: false, error: null }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Check localStorage for demo purposes
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        dispatch({ type: 'AUTH_SUCCESS', payload: user })
      } catch {
        dispatch({ type: 'LOGOUT' })
      }
    } else {
      dispatch({ type: 'LOGOUT' })
    }
  }, [])

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' })
    try {
      // TODO: Call actual auth service when Supabase is configured
      const user: User = {
        id: '1',
        email,
        name: email.split('@')[0],
      }
      localStorage.setItem('user', JSON.stringify(user))
      dispatch({ type: 'AUTH_SUCCESS', payload: user })
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: error instanceof Error ? error.message : 'Login failed',
      })
      throw error
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    dispatch({ type: 'AUTH_START' })
    try {
      // TODO: Call actual auth service when Supabase is configured
      const user: User = {
        id: '1',
        email,
        name,
      }
      localStorage.setItem('user', JSON.stringify(user))
      dispatch({ type: 'AUTH_SUCCESS', payload: user })
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: error instanceof Error ? error.message : 'Sign up failed',
      })
      throw error
    }
  }

  const logout = async () => {
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}