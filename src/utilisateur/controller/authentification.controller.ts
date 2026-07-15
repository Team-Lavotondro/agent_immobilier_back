import { Body, Controller, Post } from '@nestjs/common';
import { AuthentificationService } from '../services/authentification.service';
import { CreateUtilisateurDto } from '../dto/create-utilisateur.dto';
import { ValidateCodeDto } from '../dto/validate-code.dto';

@Controller('authentification')
export class AuthentificationController {

    constructor(private auth : AuthentificationService){}

    @Post('register')
    async SignUp(@Body() user : CreateUtilisateurDto) {
        const token = await this.auth.registreUser(user)
        return token
    }

    @Post('validate')
    async ValidateSignUp(@Body() data : ValidateCodeDto){
        const token = await this.auth.ValidateUser(data)
        return token
    }
}
