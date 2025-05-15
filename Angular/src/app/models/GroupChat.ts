export class GroupChat {
  Id: number;
  Title: string;
  OwnerId: number;
}

export class CreateGroupChatDTO {
  CreatorId: number;
  Title: string;
  UserIds: number[];
}
