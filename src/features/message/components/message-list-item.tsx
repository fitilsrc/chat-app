import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { MessageWithUserEntity } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useCrypto } from "@/lib/nha";
import { Buffer } from "buffer";
import { useEffect, useState } from "react";

interface MessageListItemProps {
  message: MessageWithUserEntity;
  isOwnMessage: boolean;
}

function base64ToUint8(data: string): Uint8Array {
  return new Uint8Array(Buffer.from(data, 'base64'));
}

export function MessageListItem({ message, isOwnMessage }: MessageListItemProps) {
  const { decrypt } = useCrypto();
  const [decryptedMessage, setDecryptedMessage] = useState('');
  
  useEffect(() => {
    if (!message.content) {
      return;
    }

    const decryptMessage = async () => {
      const decryptedMessage = await decrypt(base64ToUint8(message.content ?? ''));
      console.log("decryptedMessage", decryptedMessage);
      setDecryptedMessage(decryptedMessage);
    }

    decryptMessage();
  }, [message.content]);
  
  return (
    <View>
      {isOwnMessage ? (
        <View className="bg-blue-500/20 rounded-lg px-4 py-2 text-primary-foreground self-end my-2 max-w-2/3">
          <Text className="text-primary">{decryptedMessage}</Text>
        </View>
      ) : (
        <View className="bg-primary/10 rounded-lg px-4 py-2 text-secondary-foreground self-start my-2 max-w-2/3">
          <Text className="text-primary">{decryptedMessage}</Text>
        </View>
      )}
    </View>
  );
}
