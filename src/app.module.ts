import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { OffresModule } from './offres/offres.module';
import { FavorisModule } from './favoris/favoris.module';
import { ReservationModule } from './reservation/reservation.module';
import { ChambresModule } from './chambres/chambres.module';
import { ModelChambreModule } from './model-chambre/model-chambre.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UtilisateurModule,
    OffresModule,
    FavorisModule,
    ReservationModule,
    ChambresModule,
    ModelChambreModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
