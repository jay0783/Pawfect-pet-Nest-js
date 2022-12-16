import { Module } from "@nestjs/common";
import { MailSenderLib } from "./mail-sender.lib";
import { EmailSenderService } from "./email-sender.service";


@Module({
  providers: [MailSenderLib, EmailSenderService],
  exports: [EmailSenderService]
})
export class NodeMailerModule { }
