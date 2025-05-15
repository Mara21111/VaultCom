export class PublicChat {
  Id: number;
  Title: string;
  Description: string;
}

export class CreatePublicChatDTO {
  Id: number;
  CreatorId: number;
  Desc: string;
}
