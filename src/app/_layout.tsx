import "../../global.css";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { StatusBar } from "react-native";

export default function RootLayout() {
  const isAuthenticated = true;

  return (
    <>
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(drawer)" />
        </Stack.Protected>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
      <PortalHost />
    </>
  );
}
