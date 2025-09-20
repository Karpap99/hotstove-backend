import { Test, TestingModule } from "@nestjs/testing";
import { SubmessageLikeService } from "./submessage-like.service";

describe("SubmessageLikeService", () => {
  let service: SubmessageLikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmessageLikeService],
    }).compile();

    service = module.get<SubmessageLikeService>(SubmessageLikeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
