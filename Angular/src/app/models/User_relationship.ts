export class User_relationship
{
    user_id: number;
    friend_user_id: number;
    is_blocked: boolean;
    is_muted: boolean;
    is_friend: boolean;
    pending: boolean;
    nickname: string;
}