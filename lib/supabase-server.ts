import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Server-side Supabase client with service role
export const supabaseAdmin = (() => {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
})()
