import { BadRequestException, Injectable, Logger, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SubMessage } from "src/entity/submessage.entity";
import { Message } from "src/entity/message.entity";
import { User } from "src/entity/user.entity";
import { SubmessageLikeService } from "src/submessage-like/submessage-like.service";

@Injectable()
export class SubMessageService {
  constructor(
    @InjectRepository(SubMessage)
    private readonly repo: Repository<SubMessage>,

    @InjectRepository(User)
    private readonly users: Repository<User>,

    @InjectRepository(Message)
    private readonly messages: Repository<Message>,
    private likeService: SubmessageLikeService,
  ) {}

  async sendSubMessage(
    uuid: string,
    data: { messageId: string; text: string; receiverId: string },
  ) {
    const user = await this.users.findOne({ where: { id: uuid } });
    if (!user) throw new BadRequestException("User not found");

    const message = await this.messages.findOne({
      where: { id: data.messageId },
    });
    if (!message) throw new BadRequestException("Message not found");

    const receiver = await this.users.findOne({
      where: { id: data.receiverId },
    });
    if (!receiver) throw new BadRequestException("Receiver not found");

    const subMessage = this.repo.create({
      message,
      user,
      receiver,
      text: data.text,
    });

    const saved = await this.repo.save(subMessage);

    const newSubMsg = await this.repo.findOne({
      where: { id: saved.id },
      relations: ["user", "user.user_data", "receiver"],
    });

    if (!newSubMsg) return saved;
    await this.messages.increment({ id: message.id }, "submessagesCount", 1);
    return {
      ...newSubMsg,
      user: {
        id: newSubMsg.user.id,
        nickname: newSubMsg.user.nickname,
        profile_picture: newSubMsg.user.user_data.profile_picture,
      },
      receiver: {
        id: newSubMsg.receiver.id,
        nickname: newSubMsg.receiver.nickname,
      },
    };
  }

  async getAllByMessage(uuid: string, messageId: string) {
    const message = await this.messages.findOne({ where: { id: messageId } });
    if (!message) throw new BadRequestException("Message not found");

    const submessages = await this.repo.find({
      where: { message: { id: messageId } },
      relations: ["user", "user.user_data", "receiver"],
      order: { createDateTime: "ASC" },
    });

    const messageIds = submessages.map((msg) => msg.id);
    const userLikes = await this.likeService.findLikesForMessages(
      uuid,
      messageIds,
    );
    const likedMessageIds = new Set(userLikes.map((like) => like.message.id));

    const image_scheme = `${process.env.MINIO_ENDPOINT + "/" + process.env.MINIO_BUCKET_NAME}/profile_pictures/32x32_`;

    return submessages.map((sub) => ({
      ...sub,
      user: {
        id: sub.user.id,
        nickname: sub.user.nickname,
        profile_picture: `${image_scheme + sub.user.user_data.profile_picture}.jpeg`,
      },
      receiver: {
        id: sub.receiver.id,
        nickname: sub.receiver.nickname,
      },
      isLiked: likedMessageIds.has(sub.id),
    }));
  }

  async Delete(uuid: string, messageId: string) {
    const message = await this.repo.findOne({
      where: { id: messageId, user: { id: uuid } },
      relations: ["message"],
    });
    if (!message) throw new BadRequestException();
    await this.repo.delete({ id: messageId });
    await this.messages.decrement(
      { id: message.message.id },
      "messagesCount",
      1,
    );
    return { success: true };
  }

  async UpdateMessage(uuid: string, data: { messageId: string; text: string }) {
    const user = await this.users.findOne({ where: { id: uuid } });
    if (!user) throw new BadRequestException();

    const message = await this.repo.findOne({
      where: { id: data.messageId, user: { id: uuid } },
    });
    if (!message) throw new BadRequestException("");
    message.text = data.text;

    return await this.repo.save(message);
  }
}
