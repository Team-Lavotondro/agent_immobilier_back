import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUtilisateurDto {
  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    example: 'exemple@gmail.com',
  })
  @IsNotEmpty()
  email_util: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur",
    example: '1234fkqsdjflsqdj',
  })
  @IsNotEmpty()
  mdp_util: string;

  @ApiProperty({
    description: "Nom de l'utilisateur",
    example: 'Ruta ',
  })
  @IsNotEmpty()
  nom_util: string;
}
