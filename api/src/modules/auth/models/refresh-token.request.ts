import { IsNotEmpty, IsString } from "class-validator";


export class RefreshTokenRequest {
  @IsNotEmpty()
  @IsString()
  readonly accessToken!: string;
}
