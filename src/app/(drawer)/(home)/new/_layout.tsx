import { Link, Stack } from "expo-router";
import { Button } from "@/components/ui/button";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function NewChatLayout() {
  return (
    <Stack screenOptions={{
      headerShown: true,
    }}>
      <Stack.Screen name="new-chat"
        options={{
          title: "New Chat",
          headerTitleAlign: "center",
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
}
