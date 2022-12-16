import { IsNotEmpty, IsString } from "class-validator";
import { IsAppEmail } from "@pawfect/validators";


export class ShareRequest {
  @IsNotEmpty()
  @IsString()
  @IsAppEmail()
  email!: string;
}
