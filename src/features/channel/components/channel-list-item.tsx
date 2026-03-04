import { View } from "react-native";
import { ChannelEntity, ChannelWithUsersEntity } from "@/types/channel.entity";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { formatDistanceToNow } from "date-fns";
import { Link } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

interface ChannelListItemProps {
  channel: ChannelWithUsersEntity;
}

export default function ChannelListItem({ channel }: ChannelListItemProps) {
  const { user: currentUser } = useUser();

  const otherUser = channel.users.filter((user) => user.id !== currentUser?.id)[0];

  const channelName = channel.type === 'direct' ?
    `Chat with ${otherUser?.full_name}` :
    channel.name;

  return (
    <Link href={`/channel/${channel.id}`}>
      <View className="flex-row gap-3 border-b border-b-muted-foreground/10 p-4">
        <Avatar
          alt={channelName ?? ''}
          className="border-background web:border-0 web:ring-2 web:ring-background border-2 h-14 w-14"
        >
          <AvatarImage source={
            { uri: channel.users.filter((user) => user.id === user?.id)[0].avatar_url ?? undefined }
          } />
          <AvatarFallback>
            <Text className="text-2xl">{channel.users.filter((user) => user.id === user?.id)[0].first_name?.charAt(0)}</Text>
          </AvatarFallback>
        </Avatar>
        <View className="flex-1">
          <Text className="text-lg font-bold text-primary" numberOfLines={1}>{channelName}</Text>
          {/* <Text className="text-sm text-muted-foreground" numberOfLines={1}>{channel.lastMessage?.content}</Text> */}
        </View>
        {/* <Text className="text-sm text-muted-foreground justify-end">
          {formatDistanceToNow(channel.lastMessage?.createdAt ?? new Date(), { addSuffix: true })}
        </Text> */}
      </View>
    </Link>
  )
}
