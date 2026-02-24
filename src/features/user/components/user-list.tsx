import { users } from "@/data/users";
import UserListItem from "./user-list-item";
import { FlatList, StyleSheet } from "react-native";

export default function UserList() {
  return (
    <FlatList
      data={users}
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