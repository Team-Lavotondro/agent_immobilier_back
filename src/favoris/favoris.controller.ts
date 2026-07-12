import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FavorisService } from './favoris.service';
import { CreateFavorisDto } from './dto/create-favoris.dto';
import { UpdateFavorisDto } from './dto/update-favoris.dto';

@Controller('favoris')
export class FavorisController {
 
}
