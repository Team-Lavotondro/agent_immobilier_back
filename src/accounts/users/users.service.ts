import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Utilisateur } from './entities/utilisateur.entity';
import { Repository } from 'typeorm';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';

@Injectable()
export class UsersService {
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

  async getDetailUtil(id: string) {
    const isExist = await this.userRep.findOne({
      where: {
        role: 'user',
        id_util: id,
      },
      select: {
        id_util: true,
        email_util: true,
        nom_util: true,
        num_tel_util: true,
      },
    });
    if (!isExist) {
      throw new NotFoundException('Aucun utilisateur trouvé');
    }
    return { user: isExist };
  }

  async deleteUser(id: string) {
    const res = await this.userRep.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException('Aucun utilisateur');
    }
    return { message: 'utilisateur supprimer avec succés' };
  }

  async updateUser(id: string, updateUserDto: UpdateUtilisateurDto) {
    const user = await this.userRep.findOne({
      where: {
        id_util: id,
        role: 'user',
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    Object.assign(user, updateUserDto);
    return this.userRep.save(user);
  }
}
