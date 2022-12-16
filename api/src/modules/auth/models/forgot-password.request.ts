import { IsNotEmpty, IsString } from "class-validator";
import { IsAppEmail } from "@pawfect/validators";


export class ForgotPasswordRequest {
  @IsNotEmpty()
  @IsString()
  @IsAppEmail()
  email!: string;
}
