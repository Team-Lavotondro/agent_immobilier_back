import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Utilisateur } from './entities/utilisateur.entity';
import { Repository, ObjectLiteral } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';

type MockRepository<T extends ObjectLiteral> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T extends ObjectLiteral>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: MockRepository<Utilisateur>;

  const mockUser: Utilisateur = {
    id_util: 'uuid-1',
    nom_util: 'Rakoto',
    email_util: 'rakoto@example.com',
    mdp_util: 'hashed',
    num_tel_util: '0340000000',
    role: 'user',
    id_google: null,
    espace_vente: false,
    offres: [],
    reservations: [],
    favoris: [],
  };

  beforeEach(async () => {
    userRepo = createMockRepository<Utilisateur>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Utilisateur),
          useValue: userRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  // ───────────────── getAllUtil ─────────────────
  describe('getAllUtil', () => {
    it('devrait retourner la liste des utilisateurs avec le rôle user', async () => {
      const users = [mockUser];
      userRepo.find!.mockResolvedValue(users);

      const result = await service.getAllUtil();

      expect(userRepo.find).toHaveBeenCalledWith({
        where: { role: 'user' },
        select: {
          id_util: true,
          email_util: true,
          nom_util: true,
          num_tel_util: true,
        },
      });
      expect(result).toEqual({ users });
    });
  });

  // ───────────────── getDetailUtil ─────────────────
  describe('getDetailUtil', () => {
    it("devrait retourner le détail d'un utilisateur existant", async () => {
      userRepo.findOne!.mockResolvedValue(mockUser);

      const result = await service.getDetailUtil('uuid-1');

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { role: 'user', id_util: 'uuid-1' },
        select: {
          id_util: true,
          email_util: true,
          nom_util: true,
          num_tel_util: true,
        },
      });
      expect(result).toEqual({ user: mockUser });
    });

    it("devrait lever NotFoundException si l'utilisateur n'existe pas", async () => {
      userRepo.findOne!.mockResolvedValue(null);

      await expect(service.getDetailUtil('inexistant')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ───────────────── deleteUser ─────────────────
  describe('deleteUser', () => {
    it("devrait supprimer un utilisateur et retourner un message de succès", async () => {
      userRepo.delete!.mockResolvedValue({ affected: 1, raw: {} });

      const result = await service.deleteUser('uuid-1');

      expect(userRepo.delete).toHaveBeenCalledWith('uuid-1');
      expect(result).toEqual({ message: 'utilisateur supprimer avec succés' });
    });

    it("devrait lever NotFoundException si aucun utilisateur n'est affecté", async () => {
      userRepo.delete!.mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.deleteUser('uuid-inexistant')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ───────────────── updateUser ─────────────────
  describe('updateUser', () => {
    it("devrait mettre à jour un utilisateur et retourner l'entité sauvegardée", async () => {
      const dto: UpdateUtilisateurDto = { nom_util: 'Nouveau Nom' };
      const updatedUser = { ...mockUser, nom_util: 'Nouveau Nom' };

      userRepo.findOne!.mockResolvedValue({ ...mockUser });
      userRepo.save!.mockResolvedValue(updatedUser);

      const result = await service.updateUser('uuid-1', dto);

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { id_util: 'uuid-1', role: 'user' },
      });
      expect(userRepo.save).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    it("devrait lever NotFoundException si l'utilisateur est introuvable", async () => {
      userRepo.findOne!.mockResolvedValue(null);

      await expect(
        service.updateUser('uuid-inexistant', { nom_util: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
