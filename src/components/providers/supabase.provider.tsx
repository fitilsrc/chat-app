import { createContext, useContext, useEffect, useState } from "react";
import { createClient, processLock, SupabaseClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Platform } from "react-native";  
import { useSession } from "@clerk/clerk-expo";
import { Database } from "@/types/supabase.types";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const SupabaseContext = createContext<SupabaseClient<Database> | null>(null);

const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {

const { session } = useSession();
const [supabase, setSupabase] = useState<SupabaseClient<Database> | null>(null)

  useEffect(() => {
    const supabase = createClient<Database>(
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
    )
    setSupabase(supabase)
  }, [])

  if (!supabase) {
    return <ActivityIndicator size="large" className="flex justify-center items-center h-full" />;
  }

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
