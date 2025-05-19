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
