import { Input } from "@/components/ui/input";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useCrypto } from "@/lib/nha";
import { useUser } from "@clerk/clerk-expo";
import { Text } from "@/components/ui/text";
import { useMutation } from "@tanstack/react-query";
import { useSupabase } from "@/components/providers/supabase.provider";
import { useLocalSearchParams } from "expo-router";

interface MessageInputProps {
  channelId: string;
}

export function MessageInput({ channelId }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const { encrypt } = useCrypto();
  const supabase = useSupabase();
  const { user } = useUser();
  if (!user) {
    return <Text>Please login to continue</Text>;
  }

  const newMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const { data } = await supabase
        .from('messages')
        .insert({
          content: message,
          user_id: user.id,
          channel_id: channelId,
        })
        .select('*')
        .single()
        .throwOnError();

      return data;
    },
  });

  const handleSend = async () => {
    // const encryptedMessage = await encrypt(message);
    // console.log(encryptedMessage);
    // onSend([JSON.stringify(encryptedMessage), message]);
    newMessageMutation.mutate(message);
    setMessage("");
  };

  return (
    <SafeAreaView edges={['bottom']} style={{ paddingBottom: 16 }}>
      <View className="flex-row items-center justify-between bg-secondary border-t border-border gap-4 px-4 pb-4">
        <Input
          className="bg-muted-foreground/10 rounded-2xl flex-1 max-h-24"
          placeholder="Type a message..."
          placeholderTextColor="gray"
          value={message}
          multiline={true}
          onChangeText={setMessage}
        />
        <Pressable onPress={handleSend} className="rounded-full pl-1 h-14 w-14 my-4 items-center justify-center bg-blue-500">
          <Ionicons name="send" color="white" size={20} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
