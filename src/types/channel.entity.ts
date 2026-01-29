import { MessageEntity } from "./message.entity";

export type ChannelEntity = {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: MessageEntity;
}
