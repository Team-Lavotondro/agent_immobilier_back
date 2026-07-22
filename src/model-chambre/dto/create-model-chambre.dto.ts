import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateModelChambreDto {
  @ApiProperty({
    description: 'Nom de modèle du chambre ',
    example: 'Chambre 1ere étage',
  })
  @IsNotEmpty()
  @IsString()
  nom_model_ch: string;

  @ApiProperty({
    description: "Prix  de l'offre",
    example: 150000000,
  })
  @IsNotEmpty()
  @IsInt()
  prix_model_ch: number;

  @ApiProperty({
    description: 'Description du modèle du chambre ',
    example: 'Chambre avec cuisine , climatisation',
  })
  @IsNotEmpty()
  @IsString()
  description_model_ch: string;
}
