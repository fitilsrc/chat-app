import UserListItem from "./user-list-item";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { useSupabase } from "@/components/providers/supabase.provider";
import { useUser } from "@clerk/clerk-expo";
import { UserEntity } from "@/types/user.entity";
import { useQuery } from "@tanstack/react-query";
import { Text } from "@/components/ui/text";

interface UserListProps {
  onPress?: (user: UserEntity) => void;
}

export default function UserList({ onPress }: UserListProps) {
  const supabase = useSupabase();
  const { user } = useUser();

  const { data, isLoading, error } = useQuery<UserEntity[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: users } = await supabase
        .from('users')
        .select('*')
        .neq('id', user?.id ?? '')
        .throwOnError();

      return users;
    },
  });

  if (isLoading) {
    return <ActivityIndicator size="large" className="flex justify-center items-center h-full" />;
  }

  if (error) {
    return <Text className="text-red-500">{error.message}</Text>;
  }

  return (
    <FlatList
      data={data ?? []}
      contentContainerStyle={styles.contentContainer}
      renderItem={({ item }) => (
        <UserListItem
          user={item}
          onPress={onPress}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingTop: 16,
    width: '100%',
  },
});
