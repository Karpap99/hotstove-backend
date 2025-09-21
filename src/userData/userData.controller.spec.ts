import { Test, TestingModule } from "@nestjs/testing";
import { UserDataController } from "./userData.controller";

describe("UserController", () => {
  let controller: UserDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserDataController],
    }).compile();

    controller = module.get<UserDataController>(UserDataController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
