import { createClient as createClientBase } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  // Intentionally throw at runtime to surface misconfiguration early
  throw new Error(
    "Missing Supabase env. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
  )
}

export const createClient = () => createClientBase(supabaseUrl, supabaseAnonKey)
export const supabaseBrowser = createClient()
