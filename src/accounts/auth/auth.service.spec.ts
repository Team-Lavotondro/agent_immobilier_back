import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Utilisateur } from '../users/entities/utilisateur.entity';
import { UtilisateurEnAttente } from '../users/entities/utilisateurEnAttente.entity';
import { Repository, ObjectLiteral } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '../../common/mailer/mailer.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
jest.mock('src/utils/genereteCode', () => ({
  GenerateNanoid: jest.fn().mockReturnValue('CODE42'),
}));

type MockRepo<T extends ObjectLiteral> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const makeRepo = <T extends ObjectLiteral>(): MockRepo<T> => ({
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let utilRepo: MockRepo<Utilisateur>;
  let pendingRepo: MockRepo<UtilisateurEnAttente>;
  let jwtService: jest.Mocked<JwtService>;
  let mailerService: jest.Mocked<MailerService>;

  const mockUser: Utilisateur = {
    id_util: 'uuid-1',
    nom_util: 'Rakoto',
    email_util: 'rakoto@example.com',
    mdp_util: '$2b$10$hashedpassword',
    num_tel_util: '0340000000',
    role: 'user',
    id_google: null,
    espace_vente: false,
    offres: [],
    reservations: [],
    favoris: [],
  };

  const mockPending: UtilisateurEnAttente = {
    id_util: 'uuid-pending-1',
    nom_util: 'Rakoto',
    email_util: 'rakoto@example.com',
    mdp_util: '$2b$10$hashed',
    code: 'CODE42',
    expiredAt: new Date(Date.now() + 10 * 60 * 1000), // expire dans 10 min
  };

  beforeEach(async () => {
    utilRepo = makeRepo<Utilisateur>();
    pendingRepo = makeRepo<UtilisateurEnAttente>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(Utilisateur), useValue: utilRepo },
        {
          provide: getRepositoryToken(UtilisateurEnAttente),
          useValue: pendingRepo,
        },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn().mockResolvedValue('mock-jwt-token') },
        },
        {
          provide: MailerService,
          useValue: { SendEmail: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get(JwtService);
    mailerService = module.get(MailerService);
  });

  afterEach(() => jest.clearAllMocks());

  // ───────────────── registreUser ─────────────────
  describe('registreUser', () => {
    const dto = {
      email_util: 'rakoto@example.com',
      mdp_util: 'motdepasse123',
      nom_util: 'Rakoto',
    };

    it("devrait inscrire un utilisateur et retourner un message de confirmation", async () => {
      utilRepo.findOne!.mockResolvedValue(null); // pas de doublon
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hashed');
      pendingRepo.delete!.mockResolvedValue({ affected: 0 });
      pendingRepo.save!.mockResolvedValue(mockPending);

      const result = await service.registreUser(dto);

      expect(utilRepo.findOne).toHaveBeenCalledWith({
        where: { email_util: dto.email_util },
      });
      expect(pendingRepo.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        message: 'Un code de validation a été envoyé à votre adresse email.',
      });
    });

    it("devrait lever ConflictException si l'email est déjà utilisé", async () => {
      utilRepo.findOne!.mockResolvedValue(mockUser);

      await expect(service.registreUser(dto)).rejects.toThrow(ConflictException);
      expect(pendingRepo.save).not.toHaveBeenCalled();
    });
  });

  // ───────────────── validateUser ─────────────────
  describe('validateUser', () => {
    const dto = { email_util: 'rakoto@example.com', code: 'CODE42' };

    it("devrait valider le code et créer l'utilisateur", async () => {
      pendingRepo.findOne!.mockResolvedValue({ ...mockPending });
      utilRepo.create!.mockReturnValue(mockUser);
      utilRepo.save!.mockResolvedValue(mockUser);
      pendingRepo.delete!.mockResolvedValue({ affected: 1 });

      const result = await service.validateUser(dto);

      expect(utilRepo.save).toHaveBeenCalledTimes(1);
      expect(pendingRepo.delete).toHaveBeenCalledWith({
        email_util: dto.email_util,
      });
      expect(result).toEqual({ token: 'mock-jwt-token' });
    });

    it("devrait lever NotFoundException si aucune inscription en attente", async () => {
      pendingRepo.findOne!.mockResolvedValue(null);

      await expect(service.validateUser(dto)).rejects.toThrow(NotFoundException);
    });

    it("devrait lever BadRequestException si le code a expiré", async () => {
      const expiredPending = {
        ...mockPending,
        expiredAt: new Date(Date.now() - 1000), // expiré
      };
      pendingRepo.findOne!.mockResolvedValue(expiredPending);
      pendingRepo.delete!.mockResolvedValue({ affected: 1 });

      await expect(service.validateUser(dto)).rejects.toThrow(BadRequestException);
    });

    it("devrait lever BadRequestException si le code est invalide", async () => {
      pendingRepo.findOne!.mockResolvedValue({
        ...mockPending,
        code: 'WRONG0',
      });

      await expect(
        service.validateUser({ ...dto, code: 'MAUVAIS' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ───────────────── connexion ─────────────────
  describe('connexion', () => {
    const dto = { email_util: 'rakoto@example.com', mdp_util: 'motdepasse123' };

    it("devrait retourner un token si les identifiants sont corrects", async () => {
      utilRepo.findOne!.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.connexion(dto);

      expect(utilRepo.findOne).toHaveBeenCalledWith({
        where: { email_util: dto.email_util },
      });
      expect(result).toEqual({ token: 'mock-jwt-token' });
    });

    it("devrait lever UnauthorizedException si l'email est introuvable", async () => {
      utilRepo.findOne!.mockResolvedValue(null);

      await expect(service.connexion(dto)).rejects.toThrow(UnauthorizedException);
    });

    it("devrait lever BadRequestException si le mot de passe est incorrect", async () => {
      utilRepo.findOne!.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.connexion(dto)).rejects.toThrow(BadRequestException);
    });
  });
});
