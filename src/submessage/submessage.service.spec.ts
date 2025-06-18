import { Test, TestingModule } from '@nestjs/testing';
import { SubMessageService } from './submessage.service';

describe('SubmessageService', () => {
  let service: SubMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubMessageService],
    }).compile();

    service = module.get<SubMessageService>(SubMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
