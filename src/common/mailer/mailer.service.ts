import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { join } from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';

@Injectable()
export class MailerService {
  constructor(private readonly nestMailer: NestMailerService) {}

  async SendEmail(email: string, nom: string, code: string, sujet: string, views: string) {
    try {
      const templatePath = join(
        __dirname,
        '..',
        '..',
        'views',
        views,
      );
      const templateSource = fs.readFileSync(templatePath, 'utf8');

      const template = handlebars.compile(templateSource);

      const htmlResult = template({
        nom_util: nom,
        code: code,
      });

      await this.nestMailer.sendMail({
        to: email,
        subject: sujet,
        html: htmlResult,
      });
    } catch (error) {
      console.log("il y a un erreur lors de l'evoie email ", error);
      throw new InternalServerErrorException(
        "Erreur lors de l'envoye des emails",
      );
    }
  }
}
