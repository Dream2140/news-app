import { UserRole } from '../constants/roles';

export interface IUser {
  _id: string;
  nickname: string;
  email: string;
  password: string;
  role: UserRole;
  isActivated: boolean;
  activationLink?: string;
}

export interface IUserDto {
  id: string;
  email: string;
  nickname: string;
  role: UserRole;
  isActivated: boolean;
}

export interface CreateUserDto {
  nickname: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  nickname?: string;
  email?: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}
