import { FlatList, StyleSheet } from "react-native";
import { channels } from "@/data/channels.";
import ChannelListItem from "@/features/channel/components/channel-list-item";
import { ChannelEntity } from "@/types";

export default function HomeScreen() {
  return (
    <FlatList
      data={channels}
      contentInsetAdjustmentBehavior="always"
      contentContainerStyle={styles.contentContainer}
      renderItem={({ item }: { item: ChannelEntity }) => <ChannelListItem channel={item} />}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingTop: 96,
  },
});
