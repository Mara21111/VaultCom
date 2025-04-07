export class Message
{
    id: number;
    chat_id: number;
    user_id: number;
    previous_message_id: number;
    content: string;
    url_link: string;
    time: Date;
    is_edited: boolean;
    is_single_use: boolean;
    is_pinned: boolean;
}