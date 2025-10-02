import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { expect } from 'chai';

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
      expect(result).to.have.property('status', 'OK');
      expect(result).to.have.property('message', 'Authentication API is running');
      expect(result).to.have.property('timestamp');
      expect(result.timestamp).to.be.a('string');
    });
  });
});
