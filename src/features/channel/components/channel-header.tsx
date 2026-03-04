import { Stack } from "expo-router";
import { useChannel } from "@/components/providers/channel.provider";
import { useUser } from "@clerk/clerk-expo";
import { UserEntity } from "@/types";
import { Text } from "@/components/ui/text";

export function ChannelHeader() {
  const { channel } = useChannel();
  const { user } = useUser();

  if (!user) {
    return <Text>Please login to continue</Text>;
  }

  const otherUser = channel?.users?.find((channelUser: UserEntity) => channelUser.id !== user.id);
  const channelName = channel?.type === 'direct'
    ? otherUser?.full_name ?? ''
    : channel?.name ?? '';


  return (
    <Stack.Screen options={{
        title: channelName,
      }} />
  )
}