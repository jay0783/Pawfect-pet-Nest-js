import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { IsAppPassword } from "@pawfect/validators";


export class PasswordChangeRequest {
  @IsNotEmpty()
  @IsUUID("4")
  @IsString()
  code!: string;

  @IsNotEmpty()
  @IsString()
  @IsAppPassword()
  newPassword!: string;
}
