import "../../global.css";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useAuth } from "@clerk/clerk-expo";
import { View, ActivityIndicator, Text } from "react-native";

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
    <View className="h-full p-4">
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
    </View>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <RootLayoutStack />
    </ClerkProvider>
  );
}
