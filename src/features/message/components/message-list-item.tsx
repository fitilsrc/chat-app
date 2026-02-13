import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { MessageEntity } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface MessageListItemProps {
  message: MessageEntity;
  isOwnMessage: boolean;
}

export function MessageListItem({ message, isOwnMessage }: MessageListItemProps) {
  return (
    <View>
      {isOwnMessage ? (
        <View className="bg-blue-500/20 rounded-lg px-4 py-2 text-primary-foreground self-end my-2 max-w-2/3">
          <Text className="text-primary">{message.content}</Text>
        </View>
      ) : (
        <View className="bg-primary/10 rounded-lg px-4 py-2 text-secondary-foreground self-start my-2 max-w-2/3">
          <Text className="text-primary">{message.content}</Text>
        </View>
      )}
    </View>
  );
}
