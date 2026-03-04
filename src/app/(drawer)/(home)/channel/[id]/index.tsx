import { useLocalSearchParams } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { MessageInput } from "@/features/message/components/message-input";
import { Text } from "@/components/ui/text";
import { ChannelProvider } from "@/components/providers/channel.provider";
import { ChannelHeader } from "@/features/channel/components/channel-header";
import { ChannelMessages } from "@/features/channel/components/channel-messages";

export default function ChannelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();

  if (!user) {
    return <Text>Please login to continue</Text>;
  }

  return (
    <ChannelProvider>
      <ChannelHeader />
      <ChannelMessages />
      <MessageInput />
    </ChannelProvider>
  );
}
