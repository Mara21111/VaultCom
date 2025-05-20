export class PublicChat {
  id: number;
  title: string;
  description: string;
}

export class CreatePublicChatDTO {
  CreatorId: number;
  Title: string;
  Desc: string;
}

export class PublicChatGetterDTO {
  title: string;
  users: number;
  activeUsers: number;
}
