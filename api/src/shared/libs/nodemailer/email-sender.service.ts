import { Injectable } from '@nestjs/common';
import { readFile } from 'fs';
import { promisify } from 'util';
import * as path from 'path';
import Mustache from 'mustache';

import { EmailLetterLib } from './interfaces/email-letter.lib';
import { MailSenderLib } from './mail-sender.lib';
import { Time } from 'aws-sdk/clients/codedeploy';

@Injectable()
export class EmailSenderService {
  private forgotLetterTemplate?: string = undefined;

  private shareLetterTemplate?: string = undefined;

  private reportTemplate?: string = undefined;

  private clientRegisteredTemplate?: string = undefined;

  constructor(private readonly mailSender: MailSenderLib) {
    const projectDir = process.cwd();
    const forgotLetterHtmlPath = path.join(
      projectDir,
      './resources/mail-templates/forgot.letter.html',
    );
    const shareLetterHtmlPath = path.join(
      projectDir,
      './resources/mail-templates/share.letter.html',
    );
    const reportLetterHtmlPath = path.join(
      projectDir,
      './resources/mail-templates/report.letter.html',
    );

    const clientRegisteredHtmlPath = path.join(
      projectDir,
      './resources/mail-templates/new-user.letter.html',
    );

    Promise.all([
      EmailSenderService.readLetterTemplate(forgotLetterHtmlPath),
      EmailSenderService.readLetterTemplate(shareLetterHtmlPath),
      EmailSenderService.readLetterTemplate(reportLetterHtmlPath),
      EmailSenderService.readLetterTemplate(clientRegisteredHtmlPath),
    ])
      .then(
        ([
          forgotLetterTemplate,
          shareLetterTemplate,
          reportTemplate,
          clientRegisteredTemplate,
        ]) => {
          this.forgotLetterTemplate = forgotLetterTemplate;
          this.shareLetterTemplate = shareLetterTemplate;
          this.reportTemplate = reportTemplate;
          this.clientRegisteredTemplate = clientRegisteredTemplate;
        },
      )
      .catch((err) => {
        console.error(err);
      });
  }

  private static async readLetterTemplate(htmlPath: string): Promise<string> {
    const readFilePromised = promisify(readFile);
    const data: Buffer = await readFilePromised(htmlPath);
    const htmlTemplate: string = data.toString('utf8');
    return htmlTemplate;
  }

  async sendForgottenLetter(
    emailTo: string,
    confirmationUrl: string,
  ): Promise<void> {
    const htmlLetter = Mustache.render(this.forgotLetterTemplate!, {
      forgotLink: confirmationUrl,
    });

    const letter: EmailLetterLib = {
      subject: 'Forgot password',
      html: htmlLetter,
    };
    await this.mailSender.sendEmail(emailTo, letter);
  }

  async sendClientRegistrationNotification(
    name: string,
    email: string,
  ): Promise<void> {
    const htmlLetter = Mustache.render(this.clientRegisteredTemplate!, {
      name: name,
      email: email,
    });

    const emailTo = 'adilp.spaceo@gmail.com';
    const letter: EmailLetterLib = {
      subject: 'New Client Registered !',
      html: htmlLetter,
    };
    await this.mailSender.sendEmail(emailTo, letter);
  }

  async shareWithEmail(
    baseUrl: string,
    emailTo: string,
    instagramAppLink: string,
    facebookAppLink: string,
  ): Promise<void> {
    const htmlLetter = Mustache.render(this.shareLetterTemplate!, {
      baseUrl,
      email: emailTo,
      links: { instagram: instagramAppLink, facebook: facebookAppLink },
    });

    const letter: EmailLetterLib = {
      subject: 'Friend Share',
      html: htmlLetter,
    };
    await this.mailSender.sendEmail(emailTo, letter);
  }

  async shareWithReport(
    emailTo: string,
    serviceName: string,
    total: number,
    action1: string,
    // action2: string,
    // action3: string,
    // action4: string,
    start: string,
    end: string,
    ac1: String,
    // ac2: String,
    // ac3: String,
    // ac4: String,
  ): Promise<void> {
    const htmlLetter = Mustache.render(this.reportTemplate!, {
      email: emailTo,
      serviceName: serviceName,
      total: total,
      action1: action1,
      // action2: action2,
      // action3: action3,
      // action4: action4,
      start: start,
      end: end,
      ac1: ac1,
      // ac2: ac2,
      // ac3: ac3,
      // ac4: ac4,
    });

    const letter: EmailLetterLib = {
      subject: 'Report Share',
      html: htmlLetter,
    };
    await this.mailSender.sendEmail(emailTo, letter);
  }
}
