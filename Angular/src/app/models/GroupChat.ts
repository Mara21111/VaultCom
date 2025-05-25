export class GroupChat {
  id: number;
  title: string;
  ownerId: number;
}

export class CreateGroupChatDTO {
  creatorId: number;
  title: string;
  chatIds: number[];
}
