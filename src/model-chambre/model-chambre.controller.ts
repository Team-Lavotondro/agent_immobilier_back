import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModelChambreService } from './model-chambre.service';
import { CreateModelChambreDto } from './dto/create-model-chambre.dto';
import { UpdateModelChambreDto } from './dto/update-model-chambre.dto';

@Controller('model-chambre')
export class ModelChambreController {
  
}
