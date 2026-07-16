import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Utilisateur } from './users/entities/utilisateur.entity';
import { UtilisateurEnAttente } from './users/entities/utilisateurEnAttente.entity';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';

@Module({
  controllers: [UsersController, AuthController, AdminController],
  providers: [UsersService, AuthService, AdminService],
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
  ],
})
export class AccountsModule {}
