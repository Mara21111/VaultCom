export class User
{
    id: number;
    email: string;
    password: string;
    username: string;
    phone_number: string;
    bio: string;
    status: number;
    is_public: boolean;
    is_admin: boolean;
    created_At: Date;
    private_key: string;
    public_key: string;
    timeout_End: Date;
    ban_End: Date;
    safe_mode: boolean;
}