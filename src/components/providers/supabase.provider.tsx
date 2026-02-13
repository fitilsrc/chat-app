import { createContext, useContext, useState } from "react"
import { createClient, processLock, SupabaseClient } from "@supabase/supabase-js"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Platform } from "react-native"
import { useSession } from "@clerk/clerk-expo"

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

const SupabaseContext = createContext<SupabaseClient | null>(null)

const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const { session } = useSession();

  const [supabase] = useState(() => createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        lock: processLock,
      },
      async accessToken() {
        return session?.getToken() ?? null
      },
    }
  ))

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

export { SupabaseProvider, useSupabase }
