import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerService } from './mailer.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('MAIL_HOST');
        const port = config.get<string>('MAIL_PORT');

        return {
          transport: {
            host: host,
            port: Number(port) || 587,
            secure: false,
            auth: {
              user: config.get<string>('EMAIL_USER'),
              pass: config.get<string>('EMAIL_MDP'),
            },
          },
          defaults: {
            from: `"Gestion Immobilière" <${config.get<string>('EMAIL_EXPEDITEUR')}>`,
          },
        };
      },
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class CommonMailerModule {}
