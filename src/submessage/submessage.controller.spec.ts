import { Test, TestingModule } from '@nestjs/testing';
import { SubmessageController } from './submessage.controller';

describe('SubmessageController', () => {
  let controller: SubmessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmessageController],
    }).compile();

    controller = module.get<SubmessageController>(SubmessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
