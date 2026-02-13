import { FlatList, StyleSheet } from "react-native";
import { channels } from "@/data/channels.";
import ChannelListItem from "@/features/channel/components/channel-list-item";
import { ChannelEntity } from "@/types";

export default function HomeScreen() {
  return (
    <FlatList
      data={channels}
      contentContainerStyle={styles.contentContainer}
      renderItem={({ item }: { item: ChannelEntity }) => <ChannelListItem channel={item} />}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    top: 16,
  },
});
