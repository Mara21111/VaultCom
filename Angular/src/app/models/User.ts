export class User {
  id: number;
  email: string;
  password: string;
  username: string;
  profilePicture: string;
  bio: string;
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
  id: number;
  username: string;
  email: string;
  bio: string;
  password: string;
}

export class ToggleUserDTO {
  id: number;
  value: boolean;
}

export class BaseUserDataDTO {
  id: number;
  username: string;
  bio: string;
  profilePicture: string;
  createdAt: Date;
  banEnd: Date | null;
  timeoutEnd: Date | null;
}

export class PublicUserDataDTO {
  id: number;
  username: string;
  bio: string;
  profilePicture: string;
  createdAt: Date;
  banEnd: Date | null;
  timeoutEnd: Date | null;
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

export class AuthResult {
  success: boolean;
  token: string;
  message: string;
}

export class UserPanelInfo {
  id: number;
  username: string;
  email: string;
  bio: string;
  createdAt: string;
  banEnd: string;
  reportCount: string;
  password: string;
}

export class UserGetterDTO {
  id: number;
  username: string;
  email?: string;
  bio: string;
  profilePicture: string;
  createDate: string;
  timeoutEnd?: string;
  banEnd?: string;
  safeMode?: boolean;
  reportCount?: string;
}

export class ProfilePictureDTO {
  id: number;
  PFP: File;
}
