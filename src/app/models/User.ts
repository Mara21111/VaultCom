export class User
{
    id: number;
    email: string;
    password: string;
    username: string;
    phone_number: string;
    profile_picture: ImageBitmap;
    bio: string;
    status: number;
    is_public: boolean;
    is_admin: boolean;
    created_ad: Date;
    private_key: string;
    public_key: string;
    timeout_end: Date;
    ban_end: Date;
    safe_mode: boolean;
}