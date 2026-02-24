import UserListItem from "./user-list-item";
import { FlatList, StyleSheet } from "react-native";
import { useSupabase } from "@/components/providers/supabase.provider";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { UserEntity } from "@/types/user.entity";

export default function UserList() {
  const supabase = useSupabase();
  const { user } = useUser();
  const [users, setUsers] = useState<UserEntity[] | null>(null);
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .neq('id', user?.id || '');
      

      if (error) {
        console.error(error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  return (
    <FlatList
      data={users ?? []}
      contentContainerStyle={styles.contentContainer}
      renderItem={({ item }) => <UserListItem user={item} />}
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