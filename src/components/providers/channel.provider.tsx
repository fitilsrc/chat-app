import { createContext, useContext, useEffect, useState } from "react";
import { useSupabase } from "./supabase.provider";
import { ChannelWithUsersEntity } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native";
import { Text } from "../ui/text";

type ChannelContextType = {
  channel: ChannelWithUsersEntity | null;
}

const ChannelContext = createContext<ChannelContextType>({
  channel: null,
});

const ChannelProvider = ({ children, id }: { children: React.ReactNode, id: string }) => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  useEffect(() => {
    const myChannelSubscription = supabase.channel(`channel-${id}`, {
      config: {
        broadcast: {
          self: true,
        },
      },
    });

    function messageReceived(payload: unknown) {
      console.log('Message received', payload);
      queryClient.invalidateQueries({ queryKey: ['messages', id] });
    }

    myChannelSubscription
      .on('broadcast', {
        event: "shout"
      }, (payload) => messageReceived(payload))
      .subscribe(
        (status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Channel subscribed');
          }
        }
      );

    return () => {
      supabase.removeChannel(myChannelSubscription);
    };
  }, []);

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
