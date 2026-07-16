import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ConnexionUtilisateurDto {
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
}
