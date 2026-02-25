import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { channels } from "@/data/channels";
import { messages as initialMessages } from "@/data/messages";
import { MessageEntity } from "@/types";
import { MessageListItem } from "@/features/message/components/message-list-item";
import { useUser } from "@clerk/clerk-expo";
import { useCallback, useState } from "react";
import { MessageInput } from "@/features/message/components/message-input";
import { useSupabase } from "@/components/providers/supabase.provider";
import { useQuery } from "@tanstack/react-query";
import { ChannelEntity } from "@/types/channel.entity";

export default function ChannelScreen() {
  const [messages, setMessages] = useState<MessageEntity[]>(initialMessages);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();
  const supabase = useSupabase();

  const { data: dbChannel, isLoading, isSuccess } = useQuery({
    queryKey: ["channel", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("channels")
        .select("id, name, type")
        .eq("id", id)
        .maybeSingle();
      if (error) {
        throw error;
      }
      return data;
    },
    enabled: Boolean(id),
  });

  const isOwnMessage = useCallback((message: MessageEntity) => message.sender?.id === user?.id, [user]);

  const staticChannel = channels.find((c) => c.id === id);
  const channel: ChannelEntity | null = dbChannel
    ? { id: dbChannel.id, name: dbChannel.name ?? "Chat", avatar: "" }
    : staticChannel ?? null;

  if (isLoading) {
    return <ActivityIndicator size="large" className="flex-1 justify-center items-center" />;
  }

  if (isSuccess && !dbChannel && !staticChannel) {
    return <Redirect href="/(drawer)/(home)/(tabs)/chats" />;
  }

  if (!channel) {
    return <Redirect href="/(drawer)/(home)/(tabs)/chats" />;
  }

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

  return (
    <>
      <Stack.Screen options={{
        title: channel.name,
      }} />

      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      > */}
      <FlatList
        data={messages}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }: { item: MessageEntity }) => <MessageListItem message={item} isOwnMessage={isOwnMessage(item)} />}
        inverted={true}
        keyboardShouldPersistTaps="handled"
      />

      <MessageInput onSend={handleSend} />
      {/* </KeyboardAvoidingView> */}
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
