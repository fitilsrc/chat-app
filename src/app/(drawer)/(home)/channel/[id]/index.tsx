import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { channels } from "@/data/channels.";

export default function ChannelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const channel = channels.find((channel) => channel.id === id);

  if (!channel) {
    return <Redirect href="/(drawer)/(home)/(tabs)/chats" />;
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Stack.Screen options={{
        title: channel.name,
      }} />
      <Text>Channel Screen</Text>
    </View>
  );
}
