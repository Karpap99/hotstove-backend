import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SubMessage } from "src/entity/submessage.entity";
import { Message } from "src/entity/message.entity";
import { User } from "src/entity/user.entity";
import { SubmessageLikeService } from "src/submessage-like/submessage-like.service";
import { SMALL_AVATAR } from "src/constants";

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
    const message = await this.messages.exists({
      where: { id: data.messageId },
    });
    if (!message) throw new BadRequestException("Message not found");
    const receiver = await this.users.exists({
      where: { id: data.receiverId },
    });
    if (!receiver) throw new BadRequestException("Receiver not found");

    const subMessage = this.repo.create({
      message: { id: data.messageId },
      user: { id: uuid },
      receiver: { id: data.receiverId },
      text: data.text,
    });

    const saved = await this.repo.save(subMessage);

    const newSubMsg = await this.repo.findOne({
      where: { id: saved.id },
      relations: ["user", "user.user_data", "receiver"],
    });

    if (!newSubMsg) return saved;
    await this.messages.increment(
      { id: data.messageId },
      "submessagesCount",
      1,
    );
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
    const message = await this.messages.exists({ where: { id: messageId } });
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

    return submessages.map((sub) => ({
      ...sub,
      user: {
        id: sub.user.id,
        nickname: sub.user.nickname,
        profile_picture: SMALL_AVATAR.replace(
          "default",
          sub.user.user_data.profile_picture,
        ),
      },
      receiver: {
        id: sub.receiver.id,
        nickname: sub.receiver.nickname,
      },
      isLiked: likedMessageIds.has(sub.id),
    }));
  }

  async Delete(uuid: string, messageId: string) {
    const message = await this.repo.exists({
      where: { id: messageId, user: { id: uuid } },
    });
    if (!message) throw new BadRequestException();
    await this.repo.delete({ id: messageId });
    await this.messages.decrement({ id: messageId }, "messagesCount", 1);
    return { success: true };
  }

  async UpdateMessage(uuid: string, data: { messageId: string; text: string }) {
    const message = await this.repo.exists({
      where: { id: data.messageId, user: { id: uuid } },
    });
    if (!message) throw new BadRequestException("");
    return await this.repo.update({ id: data.messageId }, { text: data.text });
  }
}
