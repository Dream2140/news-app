import { IUserDto } from './user';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  nickname: string;
  email: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: IUserDto;
  accessToken: string;
  refreshToken: string;
}
