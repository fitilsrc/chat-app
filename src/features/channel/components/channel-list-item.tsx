import { View } from "react-native";
import { ChannelEntity } from "@/types/channel.entity";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { formatDistanceToNow } from "date-fns";
import { Link } from "expo-router";

export default function ChannelListItem({ channel }: { channel: ChannelEntity }) {
  return (
    <Link href={`/channel/${channel.id}`}>
      <View className="flex-row gap-3 border-b border-b-muted-foreground/10 p-4">
        <Avatar
          alt={channel.name}
          className="border-background web:border-0 web:ring-2 web:ring-background border-2 h-14 w-14"
        >
          <AvatarImage source={{ uri: channel.avatar }} />
          <AvatarFallback>
            <Text className="text-2xl">{channel.name.charAt(0)}</Text>
          </AvatarFallback>
        </Avatar>
        <View className="flex-1">
          <Text className="text-lg font-bold text-primary" numberOfLines={1}>{channel.name}</Text>
          <Text className="text-sm text-muted-foreground" numberOfLines={1}>{channel.lastMessage?.content}</Text>
        </View>
        <Text className="text-sm text-muted-foreground justify-end">
          {formatDistanceToNow(channel.lastMessage?.createdAt ?? new Date(), { addSuffix: true })}
        </Text>
      </View>
    </Link>
  )
}
