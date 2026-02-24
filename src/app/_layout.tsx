import "../../global.css";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useAuth } from "@clerk/clerk-expo";
import { View, ActivityIndicator, Text } from "react-native";
import { SupabaseProvider } from "@/components/providers/supabase.provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function RootLayoutStack() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return (
      <View className="flex justify-center items-center h-full">
        <ActivityIndicator size="large" color="primary" />
      </View>
    )
  }

  return (
    <>
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Protected guard={!!isSignedIn}>
          <Stack.Screen name="(drawer)" />
        </Stack.Protected>
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
      <PortalHost />
    </>
  );
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Get your key at https://dashboard.clerk.com/last-active?path=api-keys"
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <SupabaseProvider>
          <RootLayoutStack />
        </SupabaseProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
