export class User {
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

export class CreateUserDTO {
  Username: string;
  Email: string;
  Password: string;
  Bio: string;
  IsAdmin: boolean;
}

export class EditUserDTO {
  Username: string;
  Email: string;
  Password: string;
  Bio: string;
}

export class BaseUserDataDTO {
  Username: string;
  Bio: string;
  CreatedAt: Date;
  BanEnd: Date | null;
  TimeoutEnd: Date | null;
}

export class PublicUserDataDTO {
  Email: string;
  SafeMode: boolean;
}

export class UserFilterDTO {
  Banned: boolean | null;
  TimedOut: boolean | null;
  Status: number | null;
}

export class UserToggleDTO {
  ValueName: string;
  Value: boolean;
}

export class LoginDTO {
  Username: string;
  Password: string;
}

export class AuthResult
{
  Success: boolean;
  Token: string;
  Message: string;
}
