import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OffresService } from './offres.service';
import { CreateOffreDto } from './dto/create-offre.dto';
import { UpdateOffreDto } from './dto/update-offre.dto';

@Controller('offres')
export class OffresController {
  
}
