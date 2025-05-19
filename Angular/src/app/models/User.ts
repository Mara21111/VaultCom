export class User {
    id: number;
    email: string;
    password: string;
    username: string;
    bio: string;
    status: number;
    isPublic: boolean;
    isAdmin: boolean;
    createdAt: Date;
    privateKey: string;
    publicKey: string;
    timeoutEnd: Date;
    banEnd: Date;
    safeMode: boolean;
}

export class CreateUserDTO {
  username: string;
  email: string;
  password: string;
  bio: string;
  isAdmin: boolean;
}

export class EditUserDTO {
  userId: number;
  username: string;
  email: string;
  password: string;
  bio: string;
}

export class BaseUserDataDTO {
  username: string;
  bio: string;
  createdAt: Date;
  banEnd: Date | null;
  timeoutEnd: Date | null;
}

export class PublicUserDataDTO {
  email: string;
  safeMode: boolean;
}

export class UserFilterDTO {
  banned: boolean | null;
  timedOut: boolean | null;
  status: number | null;
}

export class UserToggleDTO {
  userId: number;
  valueName: string;
  value: boolean;
}

export class LoginDTO {
  username: string;
  password: string;
}

export class AuthResult
{
  success: boolean;
  token: string;
  message: string;
}
