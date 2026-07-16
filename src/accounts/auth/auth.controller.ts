import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUtilisateurDto } from '../users/dto/create-utilisateur.dto';
import { ValidateCodeDto } from '../users/dto/validate-code.dto';
import { ConnexionUtilisateurDto } from '../users/dto/connexion-utiisateur.dto';

@Controller('authentification')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() user: CreateUtilisateurDto) {
    const token = await this.auth.registreUser(user);
    return token;
  }

  @Post('validate')
  async validateSignUp(@Body() user: ValidateCodeDto) {
    const token = await this.auth.validateUser(user);
    return token;
  }

  @Post('sign-in')
  async singIn(@Body() user: ConnexionUtilisateurDto) {
    const token = await this.auth.connexion(user);
    return token;
  }
}
