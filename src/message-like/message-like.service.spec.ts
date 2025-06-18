import { Test, TestingModule } from '@nestjs/testing';
import { MessageLikeService } from './message-like.service';

describe('MessageLikeService', () => {
  let service: MessageLikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageLikeService],
    }).compile();

    service = module.get<MessageLikeService>(MessageLikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
