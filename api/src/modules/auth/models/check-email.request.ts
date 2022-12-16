import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { IsAppEmail } from "@pawfect/validators";


export class CheckEmailRequest {
  @IsNotEmpty()
  @IsString()
  @IsAppEmail()
  email!: string;
}
