import { Stack, useLocalSearchParams } from "expo-router";
import { channels } from "@/data/channels.";

export default function ChannelLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const channel = channels.find((channel) => channel.id === id);

  return (
    <Stack>
      <Stack.Screen name="index" options={{
        headerTitleAlign: "center",
      }} />
    </Stack>
  );
}
