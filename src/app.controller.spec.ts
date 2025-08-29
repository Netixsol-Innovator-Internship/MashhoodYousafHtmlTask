<<<<<<< HEAD
/* eslint-disable prettier/prettier */
=======
>>>>>>> 629360c (login signup with token and crud on cars, based on token)
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

<<<<<<< HEAD
    // eslint-disable-next-line prettier/prettier
=======
>>>>>>> 629360c (login signup with token and crud on cars, based on token)
    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
