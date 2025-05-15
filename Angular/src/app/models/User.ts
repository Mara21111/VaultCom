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

export class CreateUserDTO
{
  Username: string;
  Email: string;
  Password: string;
  Bio: string;
}

export class EditUserDTO
{
  Username: string;
  Email: string;
  Password: string;
  Bio: string;
}

export class LoginDTO
{
  username: string;
  password: string;
}

export class AuthResult
{
  success: boolean;
  token: string;
  message: string;
}
