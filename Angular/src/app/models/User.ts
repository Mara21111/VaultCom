export class User {
    id: number;
    Email: string;
    Password: string;
    Username: string;
    Bio: string;
    Status: number;
    IsPublic: boolean;
    IsAdmin: boolean;
    CreatedAt: Date;
    PrivateKey: string;
    PublicKey: string;
    TimeoutEnd: Date;
    BanEnd: Date;
    SafeMode: boolean;
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
  success: boolean;
  token: string;
  message: string;
}
