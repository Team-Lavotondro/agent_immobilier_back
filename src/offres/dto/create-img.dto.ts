import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateImageDto {
  @IsNotEmpty()
  @ApiProperty({
    description: "url de l'image",
    example: 'http://exemple.com/fjlksdjfjsdlk',
  })
  url_image: string;

  @ApiProperty({
    description: "mentionner si l'image est l'image principale ou pas",
    example: true,
  })
  is_principale: boolean;

  @ApiProperty({
    description: "identifiant de l'offre correspondant",
    example: true,
  })
  @IsUUID()
  id_offre: string;
}
