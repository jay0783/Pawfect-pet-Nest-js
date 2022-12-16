import { IsUUID } from "class-validator";


export class AttachPhotoRequest {
  @IsUUID()
  orderCheckId!: string;
}
