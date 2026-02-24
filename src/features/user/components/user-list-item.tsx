import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserEntity } from "@/types/user.entity";

interface UserListItemProps {
  user: UserEntity;
}

export default function UserListItem({ user }: UserListItemProps) {
  return (
    <View className="flex-row items-center gap-2 border-b border-b-muted-foreground/10 p-4">
      <Avatar
        alt={user.full_name || 'Unknown User'}
        className="border-background web:border-0 web:ring-2 web:ring-background border-2 h-14 w-14"
      >
        <AvatarImage source={user.avatar_url ? { uri: user.avatar_url } : undefined} />
        <AvatarFallback>
          <Text className="text-2xl">{user.first_name?.charAt(0) || 'U'}{user.last_name?.charAt(0) || 'U'}</Text>
        </AvatarFallback>
      </Avatar>
      <Text className="text-lg font-bold text-primary" numberOfLines={1}>
        {!user.first_name && !user.last_name ? "Unknown User" : user.full_name}
      </Text>
    </View>
  )
}
