export class PublicChat {
  id: number;
  title: string;
  description: string;
  ownerId: number | null;
}

export class CreatePublicChatDTO {
  creatorId: number;
  title: string;
  description: string;
}

export class EditPublicChatDTO {
  userId: number;
  chatId: number;
  title: string;
  description: string | null;
}

export class PublicChatGetterDTO {
  id: number;
  title: string;
  description: string;
  users: number;
  activeUsers: number;
}
