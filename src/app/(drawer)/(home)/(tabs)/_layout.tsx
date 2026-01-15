import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{
        title: "Channel list",
        tabBarIcon: ({ color, size }) => (<Ionicons name="chatbox" color={color} size={size} />)
      }} />
      <Tabs.Screen name="settings" options={{
        title: "Settings",
        tabBarIcon: ({ color, size }) => (<Ionicons name="settings" color={color} size={size} />)
      }} />
    </Tabs>
  );
}
