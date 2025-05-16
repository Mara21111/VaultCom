export class UserRelationship {
    Id: number;
    SenderId: number;
    ReceiverUserId: number;
    IsBlocked: boolean;
    IsMuted: boolean;
    IsFriend: boolean;
    Pending: boolean;
    Nickname: string;
}
