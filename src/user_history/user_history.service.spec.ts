import { Test, TestingModule } from '@nestjs/testing';
import { User_historyService } from './user_history.service';

describe('User_historyService', () => {
  let service: User_historyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [User_historyService],
    }).compile();

    service = module.get<User_historyService>(User_historyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
