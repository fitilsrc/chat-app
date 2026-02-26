import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { messages as initialMessages } from "@/data/messages";
import { ChannelEntity, MessageEntity } from "@/types";
import { MessageListItem } from "@/features/message/components/message-list-item";
import { useUser } from "@clerk/clerk-expo";
import { useCallback, useState } from "react";
import { MessageInput } from "@/features/message/components/message-input";
import { useSupabase } from "@/components/providers/supabase.provider";
import { useQuery } from "@tanstack/react-query";
import { Text } from "@/components/ui/text";


export default function ChannelScreen() {
  const [messages, setMessages] = useState<MessageEntity[]>(initialMessages);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();
  const supabase = useSupabase();

  const { data: channel, isLoading } = useQuery({
    queryKey: ['channel', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('channels')
        .select('*')
        .eq('id', id)
        .single()
        .throwOnError();
      return data;
    },
  });

  const handleSend = (message: string[]) => {
    setMessages([...messages, ...message.map(
      (msg, index) => {
        return {
          id: Math.random().toString(36).substring(2, 15),
          content: msg,
          createdAt: new Date(),
          sender: {
            id: user?.id ?? '',
            name: user?.fullName ?? '',
            avatar_url: user?.imageUrl ?? '',
            created_at: user?.createdAt?.toISOString() ?? '',
            first_name: user?.firstName ?? '',
            full_name: user?.fullName ?? '',
            last_name: user?.lastName ?? '',
            updated_at: user?.updatedAt?.toISOString() ?? '',
          },
        }
      }
    )]);
  }

  const isOwnMessage = useCallback((message: MessageEntity) => message.sender?.id === user?.id, [user]);

  if (isLoading) {
    return <ActivityIndicator size="large" className="flex justify-center items-center h-full" />;
  }

  if (!channel) {
    return <Text className="text-red-500">Channel not found</Text>;
  }

  return (
    <>
      <Stack.Screen options={{
        title: channel.name ?? '',
      }} />
      <FlatList
        data={messages}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }: { item: MessageEntity }) => <MessageListItem message={item} isOwnMessage={isOwnMessage(item)} />}
        inverted={true}
        keyboardShouldPersistTaps="handled"
      />

      <MessageInput onSend={handleSend} />
    </>
  );
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
