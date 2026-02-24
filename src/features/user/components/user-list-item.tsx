import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { UserEntity } from "@/types/user.entity";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserListItemProps {
  user: UserEntity;
}

export default function UserListItem({ user }: UserListItemProps) {
  return (
    <View className="flex-row items-center gap-2 border-b border-b-muted-foreground/10 p-4">
      <Avatar
        alt={user.full_name}
        className="border-background web:border-0 web:ring-2 web:ring-background border-2 h-14 w-14"
      >
        <AvatarImage source={{ uri: user.avatar }} />
        <AvatarFallback>
          <Text className="text-2xl">{user.first_name.charAt(0)}{user.last_name.charAt(0)}</Text>
        </AvatarFallback>
      </Avatar>
      <Text className="text-lg font-bold text-primary" numberOfLines={1}>{user.full_name}</Text>
    </View>
  )
}
