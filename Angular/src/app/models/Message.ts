export class Message
{
    id: number;
    chat_Id: number;
    user_Id: number;
    previous_Message_Id: number;
    content: string;
    url_Link: string;
    time: Date;
    is_Edited: boolean;
    is_Single_Use: boolean;
    is_Pinned: boolean;
}