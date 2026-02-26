import { Tables } from "./supabase.types";
import { UserEntity } from "./user.entity";

export type MessageEntity = Tables<'messages'>;
export type MessageWithUserEntity = MessageEntity & {
  user: UserEntity | null;
}
