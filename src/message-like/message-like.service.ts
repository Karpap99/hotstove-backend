import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entity/message.entity';
import { MessageLike } from 'src/entity/messageLike.entity';
import { User } from 'src/entity/user.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class MessageLikeService {
  constructor(
    @InjectRepository(MessageLike)
    private readonly repo: Repository<MessageLike>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}


  public async findLike(userId: string, messageId: string){
    return !!(await this.repo.find({where:{user:{id: userId}, message: {id: messageId}}}))
  }

  public async setLike(userId: string, messageId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('user_error');

    const message = await this.messageRepo.findOne({ where: { id: messageId } });
    if (!message) throw new BadRequestException('message_error');

    const existingLike = await this.repo.findOne({
      where: {
        user: { id: userId },
        message: { id: messageId },
      },
    });

    if (existingLike) return;

    const newLike = this.repo.create({
      user: user,
      message: message,
    });

    await this.messageRepo.increment({ id: message.id }, 'likesCount', 1);
    return await this.repo.save(newLike);
  }


  public async deleteLike(userId: string, messageId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('user_error');

    const message = await this.messageRepo.findOne({ where: { id: messageId } });
    if (!message) throw new BadRequestException('message_error');

    const existingLike = await this.repo.findOne({
      where: {
        user: { id: userId },
        message: { id: messageId },
      },
      relations: ['user', 'message'],
    });

    if (!existingLike) return;

    await this.messageRepo.decrement({ id: message.id }, 'likesCount', 1);
    return await this.repo.delete(existingLike.id);
  }

  async findLikesForMessages(userId: string, messageIds: string[]) {
    return this.repo.find({
        where: {
            user: { id: userId },
            message: { id: In(messageIds) },
        },
        relations: ['message'],
    });
}
}
