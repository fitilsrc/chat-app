import { MessageEntity } from "@/types";

export const messages: MessageEntity[] = [
  {
    id: '1',
    content: 'Hello, how are you?',
    createdAt: new Date(),
    sender: {
      id: '1',
      name: 'User 1',
    },
  },
  {
    id: '2',
    content: 'I am fine, thank you!',
    createdAt: new Date(),
    sender: {
      id: '2',
      name: 'Jane Doe',
    },
  },
  {
    id: '3',
    content: 'What is your name?',
    createdAt: new Date(),
    sender: {
      id: '1',
      name: 'User 1',
    },
  },
  {
    id: '4',
    content: 'My name is John Doe',
    createdAt: new Date(),
    sender: {
      id: '2',
      name: 'Jane Doe',
    },
  },
]