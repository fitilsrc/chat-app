import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      }}
    >
      <Tabs.Screen name="chats" options={{
        title: "Chats",
        tabBarIcon: ({ color, size }) => (<Ionicons name="chatbox" color={color} size={size} />)
      }} />
      <Tabs.Screen name="settings" options={{
        title: "Settings",
        tabBarIcon: ({ color, size }) => (<Ionicons name="settings" color={color} size={size} />)
      }} />
      <Tabs.Screen name="search" options={{
        title: "Search",
        tabBarIcon: ({ color, size }) => (<Ionicons name="search" color={color} size={size} />)
      }} />
    </Tabs>
  );
}
