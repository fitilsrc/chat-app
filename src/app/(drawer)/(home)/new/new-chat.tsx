import UserList from "@/features/user/components/user-list";
import { UserEntity } from "@/types/user.entity";
import { View } from "react-native";
import { useState } from "react";
import { useSupabase } from "@/components/providers/supabase.provider";
import { useUser } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";

export default function NewChat() {
  const [selectedUser, setSelectedUser] = useState<UserEntity | null>(null);
  const router = useRouter();
  const supabase = useSupabase();
  const { user } = useUser();
  
  const createChannel = useMutation({
    mutationFn: async (recipient: UserEntity) => {
      const { data: channel } = await supabase
      .from('channels')
      .insert({
        name: `${user?.fullName ?? ''} vs ${recipient.full_name ?? ''} conversation`,
        type: 'direct',
      })
      .select('id')
      .single()
      .throwOnError();

      if (!channel) {
        throw new Error('Failed to create channel');
      }

      await supabase
        .from('channel_users')
        .insert({
          channel_id: channel.id,
          user_id: recipient.id,
        }).throwOnError();


      if (!user) {
        throw new Error('Current user not found');
      }

      await supabase
        .from('channel_users')
        .insert({
          channel_id: channel.id,
          user_id: user.id,
        }).throwOnError();

      return channel;
    },
    onSuccess: (channel) => {
      router.replace(`/(drawer)/(home)/channel/${channel.id}`);
    },
  });
  
  const handleUserPress = (user: UserEntity) => createChannel.mutate(user);

  return (
    <View className="flex w-full h-full bg-background">
      <UserList onPress={handleUserPress}/>
    </View>
  );
}
