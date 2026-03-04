import { ActivityIndicator, FlatList } from "react-native";
import { MessageWithUserEntity } from "@/types";
import { MessageListItem } from "@/features/message/components/message-list-item";
import { useChannel } from "@/components/providers/channel.provider";
import { useUser } from "@clerk/clerk-expo";
import { Text } from "@/components/ui/text";
import { useCallback } from "react";
import { StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "@/components/providers/supabase.provider";

export function ChannelMessages() {
  const { channel } = useChannel();
  const { user } = useUser();
  const supabase = useSupabase();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', channel?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('messages').select('*, user:users(*)')
        .eq('channel_id', channel?.id ?? '')
        .throwOnError();
      return data;
    },
  })
  
  const isOwnMessage = useCallback((message: MessageWithUserEntity) => message.user?.id === user?.id, [user]);

  if (isLoading) {
    return <ActivityIndicator size="large" className="flex justify-center items-center h-full" />;
  }

  if (!user) {
    return <Text>Please login to continue</Text>;
  }

  return (
    <FlatList
        data={messages as MessageWithUserEntity[]}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }: { item: MessageWithUserEntity }) => <MessageListItem message={item} isOwnMessage={isOwnMessage(item)} />}
        inverted={true}
        keyboardShouldPersistTaps="handled"
      />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingTop: 16,
    flexDirection: 'column-reverse',
  },
});
