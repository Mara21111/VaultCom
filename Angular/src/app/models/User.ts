export class User
{
    id: number;
    email: string;
    password: string;
    username: string;
    phone_Number: string;
    bio: string;
    status: number;
    is_Public: boolean;
    is_Admin: boolean;
    created_At: Date;
    private_key: string;
    public_key: string;
    timeout_End: Date;
    ban_End: Date;
    safe_mode: boolean;
}