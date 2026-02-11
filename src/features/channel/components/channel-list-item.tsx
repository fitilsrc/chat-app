import { View } from "react-native";
import { ChannelEntity } from "@/types/channel.entity";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";

export default function ChannelListItem({ channel }: { channel: ChannelEntity }) {
  return (
    <View className="flex-row items-center gap-2">
      <Avatar
        alt={channel.name}
        className="border-background web:border-0 web:ring-2 web:ring-background border-2"
      >
        <AvatarImage source={{ uri: channel.avatar }} />
        <AvatarFallback>
          <Text>{channel.name.charAt(0)}</Text>
        </AvatarFallback>
      </Avatar>
      <Text>{channel.name}</Text>
    </View>
  )
}
