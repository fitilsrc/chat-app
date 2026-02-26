import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import ChannelListItem from "@/features/channel/components/channel-list-item";
import { ChannelWithUsersEntity } from "@/types";
import { useSupabase } from "@/components/providers/supabase.provider";
import { useQuery } from "@tanstack/react-query";
import { useSession, useUser } from "@clerk/clerk-expo";
import { Text } from "@/components/ui/text";

export default function HomeScreen() {
  const supabase = useSupabase();
  const { user, isLoaded } = useUser();
  const session = useSession();

  if (!user) {
    return <Text>Please login to continue</Text>;
  }

  const { data: channels, isLoading, error } = useQuery({
    queryKey: ['channels', user?.id],
    enabled: isLoaded && !!user && !!session,
    queryFn: async () => {
      const { data } = await supabase
       .from('channel_users')
       .select('*, channels(*, users(*))')
       .eq('user_id', user.id)
       .throwOnError();

      const channels = data.map((channel) => channel.channels);

      return channels;
    }
  });

  if (isLoading) {
    return <ActivityIndicator size="large" className="flex justify-center items-center h-full" />;
  }

  if (error) {
    return <Text className="text-red-500">{error.message}</Text>;
  }

  return (
    <FlatList
      data={channels}
      contentContainerStyle={styles.contentContainer}
      renderItem={({ item }: { item: ChannelWithUsersEntity }) => <ChannelListItem channel={item} />}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    top: 16,
  },
});
