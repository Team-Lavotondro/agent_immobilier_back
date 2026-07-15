import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Utilisateur } from '../entities/utilisateur.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Utilisateur)
    private readonly userRep: Repository<Utilisateur>,
  ) {}

  async getAllUtil() {
    const users = await this.userRep.find({
      where: { role: 'user' },
      select: {
        id_util: true,
        email_util: true,
        nom_util: true,
        num_tel_util: true,
      },
    });
    return { users };
  }

 
}
