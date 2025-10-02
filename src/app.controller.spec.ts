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

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return the status of the API', () => {
      const result = appController.getStatus();
      expect(result).toHaveProperty('status', 'OK');
      expect(result).toHaveProperty('message', 'Authentication API is running');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.timestamp).toBe('string');
    });
  });
});
