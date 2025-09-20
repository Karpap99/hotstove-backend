import { Test, TestingModule } from "@nestjs/testing";
import { MessageLikeController } from "./message-like.controller";

describe("MessageLikeController", () => {
  let controller: MessageLikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageLikeController],
    }).compile();

    controller = module.get<MessageLikeController>(MessageLikeController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
