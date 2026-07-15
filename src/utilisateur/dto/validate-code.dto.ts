import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class ValidateCodeDto {
  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    example: 'exemple@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email_util: string;

  @ApiProperty({
    description: "Code de validation de l'utilisateur",
    example: 'FH4F8O ',
  })
  @IsNotEmpty()
  code: string;
}
