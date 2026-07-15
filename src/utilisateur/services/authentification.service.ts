import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUtilisateurDto } from '../dto/create-utilisateur.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilisateur } from '../entities/utilisateur.entity';
import * as bcrypt from 'bcrypt';
import { GenerateNanoid } from 'src/utils/genereteCode';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from './mailer.service';
import { ValidateCodeDto } from '../dto/validate-code.dto';
import { UtilisateurEnAttente } from '../entities/utilisateurEnAttente.entity';
import { ConnexionUtilisateurDto } from '../dto/connexion-utiisateur.dto';

@Injectable()
export class AuthentificationService {
  constructor(
    @InjectRepository(Utilisateur) private utilRep: Repository<Utilisateur>,
    @InjectRepository(UtilisateurEnAttente)
    private utilEnAttente: Repository<UtilisateurEnAttente>,
    private jwt: JwtService,
    private mailerService: MailerService,
  ) {}

  async registreUser(userDto: CreateUtilisateurDto) {
    const { email_util, mdp_util, nom_util } = userDto;


    const userIsExist = await this.utilRep.findOne({
      where: { email_util },
    });


    if (userIsExist) {
      throw new ConflictException('Email déja utilisé');
    }

    console.log("Après avant bcrypt");
    const mdp_hached = await bcrypt.hash(
      mdp_util,
      parseInt(process.env.SALT_BCRYPT!),
    );
    
    const code = GenerateNanoid();
    
    await this.utilEnAttente.delete({ email_util });

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await this.utilEnAttente.save({
      email_util,
      mdp_util: mdp_hached,
      nom_util,
      code,
      expiredAt: expiresAt,
    });

    this.mailerService.SendEmail(
      email_util,
      nom_util,
      code,
      'Validation compte',
      'email-validation.hbs'
    ).then(()=>console.log("email bien envoyeé")).catch((e)=>console.log('erreur lors de l\'envoye \'email : ',e))

     console.log("Avant réponse");

    return {
      message: 'Un code de validation a été envoyé à votre adresse email.',
    };
  }

  async validateUser(data: ValidateCodeDto) {
    const {email_util,code} = data
    const pending = await this.utilEnAttente.findOne({ where: { email_util } });
    if (!pending) {
      throw new NotFoundException('Aucune inscription en attente pour cet email.');
    }

    if (pending.expiredAt < new Date()) {
      await this.utilEnAttente.delete({ email_util });
      throw new BadRequestException(
        "Le code a expiré, veuillez recommencer l'inscription.",
      );
    }

    if (pending.code !== code) {
      throw new BadRequestException('Code invalide.');
    }

     const utilisateur = this.utilRep.create({
      email_util: pending.email_util,
      mdp_util: pending.mdp_util,
      nom_util: pending.nom_util,
    });

    await this.utilRep.save(utilisateur);

    await this.utilEnAttente.delete({ email_util });
    const payload = { sub: utilisateur.id_util, email_util: utilisateur.email_util };
    const token =await this.jwt.signAsync(payload, { expiresIn: '3d' });
    return {token}
  }

  async connexion(user:ConnexionUtilisateurDto){
    const {email_util,mdp_util}=user
    const userIsExist = await this.utilRep.findOne({where : {email_util:email_util}})

    if(!userIsExist) {
      throw new UnauthorizedException("Verifier les informations")
    }
    const compareMdp = await bcrypt.compare(mdp_util,userIsExist.mdp_util)

    if(!compareMdp){
      throw new BadRequestException("Verifier les informations ")
    }

    const payload = {
      email_util : userIsExist.email_util,
      nom_util : userIsExist.nom_util,
      role : userIsExist.role
    }
    const token = await this.jwt.signAsync(payload,{expiresIn : '20d'})
    return {token : token}
  }

}
