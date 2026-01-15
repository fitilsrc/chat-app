import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Button size="lg" className="rounded-md">
        <Text>Click me</Text>
      </Button>
    </View>
  );
}
