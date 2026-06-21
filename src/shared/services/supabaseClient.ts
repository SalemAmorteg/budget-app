import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔵 Supabase client initializing with URL:', supabaseUrl)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing env variables')
  throw new Error('Missing Supabase env vars')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
console.log('✅ Supabase client initialized')