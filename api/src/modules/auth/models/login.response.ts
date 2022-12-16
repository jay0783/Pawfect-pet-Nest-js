import { UserRoleEnum } from '@pawfect/db/entities/enums';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  accessExpiredAt: number;
  refreshExpiredAt: number;
  role?: UserRoleEnum;
  status?: number;
}
