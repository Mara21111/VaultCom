export class Message
{
    Id: number;
    ChatId: number;
    UserId: number;
    PreviousMessageId: number;
    Content: string;
    URLLink: string;
    Time: Date;
    IsEdited: boolean;
    IsPinned: boolean;
}