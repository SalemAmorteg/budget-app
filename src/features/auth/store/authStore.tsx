import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { supabase } from '@/shared/services/supabaseClient'

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
    loading: false,
    error: null,
  })

  // Check session on mount
  useEffect(() => {
    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (userData) {
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                id: userData.id,
                email: userData.email,
                name: userData.name,
              },
            })
          }
        } else {
          dispatch({ type: 'LOGOUT' })
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

const checkSession = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email || '',
        },
      })
    } else {
      // ⭐ MUY IMPORTANTE: Despachar LOGOUT para que loading sea false
      dispatch({ type: 'LOGOUT' })
    }
  } catch (error) {
    console.error('Session check failed:', error)
    dispatch({ type: 'LOGOUT' })
  }
}

  const signup = async (email: string, password: string, name: string) => {
  dispatch({ type: 'AUTH_START' })
  try {
    console.log('1️⃣ Starting signup for:', email, name)

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    console.log('2️⃣ Signup response:', { data, signupError })

    if (signupError) {
      console.log('3️⃣ Signup error:', signupError.message)
      throw signupError
    }

    if (!data.user) {
      console.log('4️⃣ No user ID')
      throw new Error('No user ID')
    }

    console.log('5️⃣ User created with ID:', data.user.id)

    // Wait for trigger
    console.log('6️⃣ Waiting for trigger...')
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('7️⃣ Querying users table...')
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    console.log('8️⃣ Query result:', { userData, fetchError })

    if (fetchError) {
      console.log('9️⃣ Fetch error:', fetchError.message)
      throw fetchError
    }

    if (!userData) {
      console.log('🔟 No user data')
      throw new Error('User not found')
    }

    console.log('✅ SUCCESS - User created:', userData)

    dispatch({
      type: 'AUTH_SUCCESS',
      payload: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sign up failed'
    console.log('❌ FINAL ERROR:', message)
    dispatch({ type: 'AUTH_ERROR', payload: message })
    throw error
  }
}

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' })
    try {
      console.log('🔑 Logging in:', email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      if (!data.user) throw new Error('Login failed')

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (!userData) throw new Error('User profile not found')

      console.log('✅ Login successful')

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
        },
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      console.error('❌ Login error:', message)
      dispatch({ type: 'AUTH_ERROR', payload: message })
      throw error
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      dispatch({ type: 'LOGOUT' })
    } catch (error) {
      console.error('Logout error:', error)
    }
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