import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "src/entity/message.entity";
import { MessageLike } from "src/entity/messageLike.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class MessageLikeService {
  constructor(
    @InjectRepository(MessageLike)
    private readonly repo: Repository<MessageLike>,

    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  public async findLike(userId: string, messageId: string) {
    return !!(await this.repo.find({
      where: { user: { id: userId }, message: { id: messageId } },
    }));
  }

  public async setLike(userId: string, messageId: string) {
    const message = await this.messageRepo.exists({
      where: { id: messageId },
    });
    if (!message) throw new BadRequestException("message_error");

    const existingLike = await this.repo.exists({
      where: {
        user: { id: userId },
        message: { id: messageId },
      },
    });
    if (existingLike) return;

    const newLike = this.repo.create({
      user: { id: userId },
      message: { id: messageId },
    });

    await this.messageRepo.increment({ id: messageId }, "likesCount", 1);
    return await this.repo.save(newLike);
  }

  public async deleteLike(userId: string, messageId: string) {
    const message = await this.messageRepo.exists({
      where: { id: messageId },
    });
    if (!message) throw new BadRequestException("message_error");

    const existingLike = await this.repo.findOne({
      where: {
        user: { id: userId },
        message: { id: messageId },
      },
    });
    if (!existingLike) return;

    await this.messageRepo.decrement({ id: messageId }, "likesCount", 1);
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
