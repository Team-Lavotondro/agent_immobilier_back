import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Utilisateur } from './entities/utilisateur.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthentificationService } from './services/authentification.service';
import { UserService } from './services/user.service';
import { AuthentificationController } from './controller/authentification.controller';
import { MailerService } from './services/mailer.service';
import { UtilisateurEnAttente } from './entities/utilisateurEnAttente.entity';
import { UserController } from './controller/user.controller';

@Module({
  controllers: [UserController, AuthentificationController],
  providers: [UserService, AuthentificationService, MailerService],
  imports: [
    TypeOrmModule.forFeature([Utilisateur, UtilisateurEnAttente]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_KEY'),
        signOptions: {
          expiresIn: '1h',
        },
      }),
    }),
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
})
export class UtilisateurModule {}
