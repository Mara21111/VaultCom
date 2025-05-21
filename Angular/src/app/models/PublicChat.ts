export class PublicChat {
  id: number;
  title: string;
  description: string;
}

export class CreatePublicChatDTO {
  creatorId: number;
  title: string;
  desc: string;
}

export class PublicChatGetterDTO {
  id: number;
  title: string;
  users: number;
  activeUers: number;
}
