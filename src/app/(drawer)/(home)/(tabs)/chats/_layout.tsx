import { Stack } from "expo-router";
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
          headerTransparent: true,

          headerLeft: () => (
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onPress={() => navigation.openDrawer()}
            >
              <Ionicons name="menu" color="gray" size={24} />
            </Button>
          ),
          headerRight: () => (
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onPress={() => navigation.openDrawer()}
            >
              <Ionicons name="add" color="gray" size={24} />
            </Button>
          ),
        })}
      />
    </Stack>
  );
}
