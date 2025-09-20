import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SMALL_AVATAR } from "src/constants";
import { Follower } from "src/entity/follower.entity";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class FollowerService {
  constructor(
    @InjectRepository(Follower) private readonly repo: Repository<Follower>,
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}

  async isFollowed(follower: string, followed: string) {
    return !!(await this.repo.findOne({
      where: { followed: { id: followed }, follower: { id: follower } },
    }));
  }

  async FollowOn(uuid: string, followTo: string) {
    if (uuid === followTo)
      throw new BadRequestException("Cannot follow yourself");

    const follower = await this.user.findOne({ where: { id: uuid } });
    if (!follower) throw new BadRequestException("Follower not found");

    const followed = await this.user.findOne({ where: { id: followTo } });
    if (!followed) throw new BadRequestException("User to follow not found");

    try {
      const payload = this.repo.create({ follower, followed });
      const result = await this.repo.save(payload);

      await this.user.increment({ id: followed.id }, "followersCount", 1);

      return result;
    } catch (err) {
      if (err.code === "23505") {
        return;
      }
      throw err;
    }
  }

  async UnFollow(uuid: string, followTo: string) {
    if (uuid === followTo)
      throw new BadRequestException("Cannot unfollow yourself");

    const follower = await this.user.findOne({ where: { id: uuid } });
    if (!follower) throw new BadRequestException("Follower not found");

    const followed = await this.user.findOne({ where: { id: followTo } });
    if (!followed) throw new BadRequestException("User to follow not found");

    try {
      const follow = await this.repo.findOne({
        where: { followed: { id: followed.id }, follower: { id: follower.id } },
      });
      if (!follow) throw new BadRequestException("follow not found");
      await this.repo.delete(follow.id);
      await this.user.decrement({ id: followed.id }, "followersCount", 1);

      return { success: true };
    } catch (err) {
      if (err.code === "23505") {
        return;
      }
      throw err;
    }
  }

  async FollowedByUser(uuid: string) {
    const user = await this.user.findOne({ where: { id: uuid } });
    if (!user) throw new BadRequestException("User not found");
    const follows = await this.repo.find({
      where: { follower: { id: user.id } },
      relations: ["followed", "followed.user_data"],
    });
    const formated = await Promise.all(
      follows.map((follow) => {
        return {
          id: follow.followed.id,
          nickname: follow.followed.nickname,
          profile_picture: SMALL_AVATAR.replace(
            "default",
            follow.followed.user_data.profile_picture,
          ),
        };
      }),
    );
    return formated;
  }
}
