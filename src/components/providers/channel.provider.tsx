import { createContext, useContext, useEffect } from "react";
import { useSupabase } from "./supabase.provider";
import { ChannelWithUsersEntity } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator } from "react-native";
import { Text } from "../ui/text";
import { RealtimeChannel } from "@supabase/supabase-js";

type ChannelContextType = {
  channel: ChannelWithUsersEntity | null;
}

const ChannelContext = createContext<ChannelContextType>({
  channel: null,
});

const ChannelProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = useSupabase();
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    if (!id) {
      return;
    }
    const myChannelSubscription = supabase.channel(id);

    function messageReceived(payload: { payload: unknown }) {
      console.log(payload);
    }

    myChannelSubscription
      .on("broadcast", { event: "shout" }, (payload: { payload: unknown }) => messageReceived(payload))

    myChannelSubscription.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Channel subscribed');

        myChannelSubscription.send({
          type: 'broadcast',
          event: 'shout',
          payload: {
            message: 'Hello, world!',
          },
        });
      }
    });

    return () => {
      supabase.removeChannel(myChannelSubscription);
    };
  }, [id, supabase]);

  const { data: channel, isLoading } = useQuery({
    queryKey: ['channel', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('channels')
        .select('*, users(*), messages(*, user:users(*))')
        .eq('id', id)
        .single()
        .throwOnError();

      return data;
    },
  });

  if (isLoading) {
    return <ActivityIndicator size="large" className="flex justify-center items-center h-full" />;
  }

  if (!channel) {
    return <Text className="text-red-500">Channel not found</Text>;
  }

  return (
    <ChannelContext.Provider value={{ channel }}>
      {children}
    </ChannelContext.Provider>
  )
}

const useChannel = () => {
  const context = useContext(ChannelContext)
  if (!context) {
    throw new Error('useChannel must be used within a ChannelProvider')
  }
  return context
}

export { ChannelProvider, useChannel }
