/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SendMailOptions, Transporter, createTransport } from "nodemailer";
import { htmlToText } from "nodemailer-html-to-text";

import { EmailConfig } from "@pawfect/configs";
import { EmailLetterLib } from "./interfaces/email-letter.lib";


@Injectable()
export class MailSenderLib {
  private readonly transporter: Transporter;

  constructor(configService: ConfigService) {
    const config = configService.get("email");
    this.transporter = createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass
      }
    });
    this.transporter.use("compile", htmlToText());
  }

  async sendEmail(emailTo: string, letter: EmailLetterLib): Promise<void> {
    const sendOption: SendMailOptions = {
      from: EmailConfig.from,
      to: emailTo,
      html: letter.html,
      subject: letter.subject
    };

    sendOption.html = letter.html;
    await this.transporter.sendMail(sendOption);
  }
}
