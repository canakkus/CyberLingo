import { createClient } from '@supabase/supabase-js'

// Use environment variables for production (Vercel), fallback to hardcoded for local dev
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ldsimtioqcbseyblmwvg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_WpAl4PxJW7jSfdTeJgOJmw_Ju-7ML5n'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
