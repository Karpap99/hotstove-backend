import { Test, TestingModule } from '@nestjs/testing';
import { User_historyController } from './user_history.controller';

describe('User_historyController', () => {
  let controller: User_historyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [User_historyController],
    }).compile();

    controller = module.get<User_historyController>(User_historyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
