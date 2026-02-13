import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { FlatList, View, KeyboardAvoidingView, Platform } from "react-native";
import { channels } from "@/data/channels";
import { messages as initialMessages } from "@/data/messages";
import { MessageEntity } from "@/types";
import { MessageListItem } from "@/features/message/components/message-list-item";
import { useUser } from "@clerk/clerk-expo";
import { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { MessageInput } from "@/features/message/components/message-input";

export default function ChannelScreen() {
  const [messages, setMessages] = useState<MessageEntity[]>(initialMessages);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();

  const isOwnMessage = useCallback((message: MessageEntity) => message.sender?.id === user?.id, [user]);

  const channel = channels.find((channel) => channel.id === id);

  if (!channel) {
    return <Redirect href="/(drawer)/(home)/(tabs)/chats" />;
  }

  const handleSend = (message: string) => {
    setMessages([...messages, {
      id: Math.random().toString(36).substring(2, 15),
      content: message,
      createdAt: new Date(),
      sender: {
        id: user?.id ?? '',
        name: user?.fullName ?? '',
      },
    }]);
  };

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
          inverted={false}
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
  },
});
