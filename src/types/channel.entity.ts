import { MessageWithUserEntity } from "./message.entity";
import { Tables } from "./supabase.types";
import { UserEntity } from "./user.entity";

export type ChannelEntity = Tables<'channels'>;
export type ChannelWithUsersEntity = ChannelEntity & {
  users: UserEntity[];
}
