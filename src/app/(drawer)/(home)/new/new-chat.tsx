import UserList from "@/features/user/components/user-list";
import { View } from "react-native";

export default function NewChat() {
  return (
    <View className="flex w-full h-full bg-background">
      <UserList />
    </View>
  );
}
