import { Test, TestingModule } from "@nestjs/testing";
import { SubmessageLikeController } from "./submessage-like.controller";

describe("SubmessageLikeController", () => {
  let controller: SubmessageLikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmessageLikeController],
    }).compile();

    controller = module.get<SubmessageLikeController>(SubmessageLikeController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
