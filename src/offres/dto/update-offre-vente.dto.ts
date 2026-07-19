import { PartialType } from '@nestjs/mapped-types';
import { CreateOffreVenteDto  } from './create-offre-vente.dto';

export class UpdateOffreDto extends PartialType(CreateOffreVenteDto) {}
