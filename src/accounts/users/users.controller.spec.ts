import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  const mockUser = {
    id_util: 'uuid-1',
    nom_util: 'Rakoto',
    email_util: 'rakoto@example.com',
    num_tel_util: '0340000000',
  };

  beforeEach(async () => {
    const mockUsersService: Partial<jest.Mocked<UsersService>> = {
      getAllUtil: jest.fn(),
      getDetailUtil: jest.fn(),
      deleteUser: jest.fn(),
      updateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  // ───────────────── GET /user ─────────────────
  describe('getAllUser', () => {
    it('devrait retourner la liste des utilisateurs', async () => {
      const expected = { users: [mockUser] };
      usersService.getAllUtil.mockResolvedValue(expected as any);

      const result = await controller.getAllUser();

      expect(usersService.getAllUtil).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });
  });

  // ───────────────── GET /user/:id ─────────────────
  describe('getDetailUser', () => {
    it("devrait retourner le détail d'un utilisateur", async () => {
      const expected = { user: mockUser };
      usersService.getDetailUtil.mockResolvedValue(expected as any);

      const result = await controller.getDetailUser('uuid-1');

      expect(usersService.getDetailUtil).toHaveBeenCalledWith('uuid-1');
      expect(result).toEqual(expected);
    });

    it("devrait propager une NotFoundException si l'utilisateur est introuvable", async () => {
      usersService.getDetailUtil.mockRejectedValue(
        new NotFoundException('Aucun utilisateur trouvé'),
      );

      await expect(controller.getDetailUser('uuid-inexistant')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ───────────────── DELETE /user/:id ─────────────────
  describe('deleteUser', () => {
    it("devrait supprimer un utilisateur et retourner le message de succès", async () => {
      const expected = { message: 'utilisateur supprimer avec succés' };
      usersService.deleteUser.mockResolvedValue(expected);

      const result = await controller.deleteUser('uuid-1');

      expect(usersService.deleteUser).toHaveBeenCalledWith('uuid-1');
      expect(result).toEqual(expected);
    });

    it("devrait propager une NotFoundException si l'utilisateur est introuvable", async () => {
      usersService.deleteUser.mockRejectedValue(
        new NotFoundException('Aucun utilisateur'),
      );

      await expect(controller.deleteUser('uuid-inexistant')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ───────────────── PATCH /user/:id ─────────────────
  describe('updateUser', () => {
    it('devrait mettre à jour un utilisateur', async () => {
      const dto: UpdateUtilisateurDto = { nom_util: 'Nouveau Nom' };
      const expected = { ...mockUser, nom_util: 'Nouveau Nom' };
      usersService.updateUser.mockResolvedValue(expected as any);

      const result = await controller.updateUser('uuid-1', dto);

      expect(usersService.updateUser).toHaveBeenCalledWith('uuid-1', dto);
      expect(result).toEqual(expected);
    });

    it("devrait propager une NotFoundException si l'utilisateur est introuvable", async () => {
      usersService.updateUser.mockRejectedValue(
        new NotFoundException('Utilisateur introuvable'),
      );

      await expect(
        controller.updateUser('uuid-inexistant', { nom_util: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
