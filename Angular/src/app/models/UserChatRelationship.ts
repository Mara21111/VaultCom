export class UserChatRelationship {
    id: number;
    userId: number;
    chatId: number;
    mutedChat: boolean;
}

export class UserChatRelationshipDTO {
  chatId: number;
  userId: number;
}
