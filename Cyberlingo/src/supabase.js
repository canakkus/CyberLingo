import { createClient } from '@supabase/supabase-js'

// REPLACE WITH YOUR ACTUAL SUPABASE CREDENTIALS
const supabaseUrl = 'https://ldsimtioqcbseyblmwvg.supabase.co'
const supabaseAnonKey = 'sb_publishable_WpAl4PxJW7jSfdTeJgOJmw_Ju-7ML5n'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
