export class Message {
    id: number;
    chatId: number;
    userId: number;
    previousMessageId: number;
    content: string;
    urlLink: string;
    time: Date;
    isEdited: boolean;
    isPinned: boolean;
}

export class MessageDTO {
  userId: number;
  chatId: number;
  content: string;
  replyMessageId: number | null;
}
