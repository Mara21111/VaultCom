export class UserRelationship {
    id: number;
    senderId: number;
    receiverUserId: number;
    isBlocked: boolean;
    isMuted: boolean;
    isFriend: boolean;
    pending: boolean;
    nickname: string;
}

export class UserRelationshipDTO {
  requestorId: number;
  targetId: number;
}
