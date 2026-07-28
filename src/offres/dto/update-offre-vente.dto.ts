import { PartialType } from '@nestjs/swagger';
import { CreateOffreVenteDto } from './create-offre-vente.dto';

export class UpdateOffreVenteDto extends PartialType(CreateOffreVenteDto) {}
