import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';

jest.mock('fs');
jest.mock('handlebars');

describe('MailerService', () => {
  let service: MailerService;
  let nestMailer: jest.Mocked<NestMailerService>;

  const mockSendMail = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailerService,
        {
          provide: NestMailerService,
          useValue: { sendMail: mockSendMail },
        },
      ],
    }).compile();

    service = module.get<MailerService>(MailerService);
    nestMailer = module.get(NestMailerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('SendEmail', () => {
    const email = 'test@example.com';
    const nom = 'Rakoto';
    const code = 'ABC123';
    const sujet = 'Validation compte';
    const views = 'email-validation.hbs';
    const fakeHtml = '<p>Bonjour Rakoto, votre code: ABC123</p>';

    it('devrait envoyer un email avec succès', async () => {
      // Arrange
      (fs.readFileSync as jest.Mock).mockReturnValue('<p>{{nom_util}} {{code}}</p>');
      const compiledTemplate = jest.fn().mockReturnValue(fakeHtml);
      (handlebars.compile as jest.Mock).mockReturnValue(compiledTemplate);
      mockSendMail.mockResolvedValue(undefined);

      // Act
      await service.SendEmail(email, nom, code, sujet, views);

      // Assert
      expect(fs.readFileSync).toHaveBeenCalledTimes(1);
      expect(handlebars.compile).toHaveBeenCalledTimes(1);
      expect(compiledTemplate).toHaveBeenCalledWith({ nom_util: nom, code });
      expect(mockSendMail).toHaveBeenCalledWith({
        to: email,
        subject: sujet,
        html: fakeHtml,
      });
    });

    it("devrait lever InternalServerErrorException si la lecture du template échoue", async () => {
      // Arrange
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });

      // Act & Assert
      await expect(
        service.SendEmail(email, nom, code, sujet, views),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it("devrait lever InternalServerErrorException si sendMail échoue", async () => {
      // Arrange
      (fs.readFileSync as jest.Mock).mockReturnValue('<p>{{nom_util}}</p>');
      const compiledTemplate = jest.fn().mockReturnValue(fakeHtml);
      (handlebars.compile as jest.Mock).mockReturnValue(compiledTemplate);
      mockSendMail.mockRejectedValue(new Error('SMTP connection refused'));

      // Act & Assert
      await expect(
        service.SendEmail(email, nom, code, sujet, views),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
