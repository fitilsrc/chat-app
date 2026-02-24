import { Link, Stack } from "expo-router";
import { Button } from "@/components/ui/button";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ChatsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={({ navigation }) => ({
          title: "Chats",
          headerTitleAlign: "center",
          headerLargeTitle: true,
          headerLeft: () => (
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-16 w-16 p-4 mt-4 mb-4"
              onPress={() => navigation.openDrawer()}
            >
              <Ionicons name="menu" color="gray" size={24} />
            </Button>
          ),
          headerRight: () => (
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-16 w-16 p-4"
            >
              <Link href="/(drawer)/(home)/new/new-chat" asChild>
                <Ionicons name="add" color="gray" size={24} />
              </Link>
            </Button>
          ),
        })}
      />
    </Stack>
  );
}
