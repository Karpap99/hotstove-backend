import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { SubmessageLikes } from "src/entity/submessageLike.entity";
import { User } from "src/entity/user.entity";
import { SubMessage } from "src/entity/submessage.entity";

@Injectable()
export class SubmessageLikeService {
  constructor(
    @InjectRepository(SubmessageLikes)
    private readonly repo: Repository<SubmessageLikes>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(SubMessage)
    private readonly submessageRepo: Repository<SubMessage>,
  ) {}

  public async setLike(userId: string, submessageId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException("user_error");

    const submessage = await this.submessageRepo.findOne({
      where: { id: submessageId },
    });
    if (!submessage) throw new BadRequestException("submessage_error");

    const existingLike = await this.repo.findOne({
      where: {
        user: { id: userId },
        message: { id: submessageId },
      },
    });

    if (existingLike) return;

    const newLike = this.repo.create({
      user,
      message: submessage,
    });

    await this.submessageRepo.increment({ id: submessage.id }, "likesCount", 1);
    return await this.repo.save(newLike);
  }

  public async deleteLike(userId: string, submessageId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException("user_error");

    const submessage = await this.submessageRepo.findOne({
      where: { id: submessageId },
    });
    if (!submessage) throw new BadRequestException("submessage_error");

    const existingLike = await this.repo.findOne({
      where: {
        user: { id: userId },
        message: { id: submessageId },
      },
      relations: ["user", "message"],
    });

    if (!existingLike) return;

    await this.submessageRepo.decrement({ id: submessage.id }, "likesCount", 1);
    return await this.repo.delete(existingLike.id);
  }

  async findLikesForMessages(userId: string, messageIds: string[]) {
    return this.repo.find({
      where: {
        user: { id: userId },
        message: { id: In(messageIds) },
      },
      relations: ["message"],
    });
  }
}
