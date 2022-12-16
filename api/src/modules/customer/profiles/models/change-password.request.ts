import { IsNotEmpty, IsString } from "class-validator";
import { IsAppPassword } from "@pawfect/validators";


export class ChangePasswordRequest {
  @IsNotEmpty()
  @IsString()
  @IsAppPassword()
  oldPassword!: string;

  @IsNotEmpty()
  @IsString()
  @IsAppPassword()
  newPassword!: string;
}
