import { View, Text } from "react-native";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-expo";

export default function Settings() {
  const { signOut } = useAuth()

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Settings</Text>
      <Button variant="default" onPress={() => signOut()}>
        <Text className="text-primary-foreground">Sign Out</Text>
      </Button>
    </View>
  );
}
