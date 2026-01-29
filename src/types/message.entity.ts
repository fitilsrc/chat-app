import { UserEntity } from "./user.entity"

export type MessageEntity = {
  id: string;
  content: string;
  createdAt: Date;
  sender?: UserEntity;
  image?: string;
}