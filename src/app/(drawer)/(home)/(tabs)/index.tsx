import { View, Text } from "react-native";
import { Button } from "@/components/ui/button";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Button size="lg" className="rounded-full">
        <Text className="text-primary-foreground">Click me</Text>
      </Button>
    </View>
  );
}
