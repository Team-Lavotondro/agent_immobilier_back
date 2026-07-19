import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateFavorisDto {
  @ApiProperty({
    description: "ID de l'utilisateur qui met l'offre en favoris",
    example: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  })
  @IsNotEmpty()
  @IsUUID()
  id_util: string;

  @ApiProperty({
    description: "ID de l'offre mise en favoris",
    example: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  })
  @IsNotEmpty()
  @IsUUID()
  id_offre: string;
}
