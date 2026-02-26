import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { MessageWithUserEntity } from "@/types";
import { MessageListItem } from "@/features/message/components/message-list-item";
import { useUser } from "@clerk/clerk-expo";
import { useCallback } from "react";
import { MessageInput } from "@/features/message/components/message-input";
import { useSupabase } from "@/components/providers/supabase.provider";
import { useQuery } from "@tanstack/react-query";
import { Text } from "@/components/ui/text";


export default function ChannelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();
  const supabase = useSupabase();

  if (!user) {
    return <Text>Please login to continue</Text>;
  }

  const { data: channel, isLoading } = useQuery({
    queryKey: ['channel', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('channels')
        .select('*, users(*), messages(*, user:users(*))')
        .eq('id', id)
        .single()
        .throwOnError();
      
        console.log(JSON.stringify(data, null, 2));
        return data;
    },
  });

  const isOwnMessage = useCallback((message: MessageWithUserEntity) => message.user?.id === user?.id, [user]);

  if (isLoading) {
    return <ActivityIndicator size="large" className="flex justify-center items-center h-full" />;
  }

  if (!channel) {
    return <Text className="text-red-500">Channel not found</Text>;
  }

  const otherUser = channel?.users?.find((channelUser) => channelUser.id !== user.id);
  const channelName = channel?.type === 'direct'
    ? otherUser?.full_name ?? ''
    : channel?.name ?? '';

  return (
    <>
      <Stack.Screen options={{
        title: channelName,
      }} />
      <FlatList
        data={channel.messages as MessageWithUserEntity[]}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }: { item: MessageWithUserEntity }) => <MessageListItem message={item} isOwnMessage={isOwnMessage(item)} />}
        inverted={true}
        keyboardShouldPersistTaps="handled"
      />

      <MessageInput channelId={id} />
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
