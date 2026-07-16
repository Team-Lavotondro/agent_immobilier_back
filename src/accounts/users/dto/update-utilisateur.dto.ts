import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUtilisateurDto {
  @ApiPropertyOptional({
    description: "Nom de l'utilisateur",
    example: 'Rakoto',
  })
  @IsOptional()
  @IsString()
  nom_util?: string;

  @ApiPropertyOptional({
    description: "Numéro de téléphone de l'utilisateur",
    example: '0340000000',
  })
  @IsOptional()
  @IsString()
  num_tel_util?: string;

  @ApiPropertyOptional({
    description: "Nouveau mot de passe de l'utilisateur",
    example: 'NouveauMotDePasse123',
  })
  @IsOptional()
  @IsString()
  mdp_util?: string;

  @ApiPropertyOptional({
    description: "Activation de l'espace de vente",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  espace_vente?: boolean;
}
