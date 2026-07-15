import { Body, Controller, Post } from '@nestjs/common';
import { AuthentificationService } from '../services/authentification.service';
import { CreateUtilisateurDto } from '../dto/create-utilisateur.dto';
import { ValidateCodeDto } from '../dto/validate-code.dto';
import { ConnexionUtilisateurDto } from '../dto/connexion-utiisateur.dto';

@Controller('authentification')
export class AuthentificationController {
  constructor(private auth: AuthentificationService) {}

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
