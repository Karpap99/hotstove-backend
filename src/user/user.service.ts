import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { Repository } from "typeorm";
import { UserDTO } from "./dto/user.dto";
import { UploaderService } from "src/uploader/uploader.service";
import { PostService } from "src/post/post.service";
import { FollowerService } from "src/follower/follower.service";
import { BIG_AVATAR } from "src/constants";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    @Inject(forwardRef(() => UploaderService))
    @Inject(forwardRef(() => PostService))
    private follower: FollowerService,
  ) {}

  public async getAll() {
    return await this.repo.find();
  }

  public async IsUserExist(uuid: string): Promise<boolean> {
    return await this.repo.exists({ where: { id: uuid } });
  }

  public async getUserById(id: string) {
    const result = await this.repo.findOne({
      where: {
        id: id,
      },
    });
    if (!result) throw new BadRequestException("No user");
    return result;
  }

  public async getUserWithPostsAndSubscribe(requestedUser: string) {
    const user = await this.repo.findOne({ where: { id: requestedUser } });
    if (!user) {
      throw new BadRequestException(
        `User with id ${requestedUser} doen't exist`,
      );
    }
    user.user_data.profile_picture = BIG_AVATAR.replace(
      "default",
      user.user_data.profile_picture,
    );
    return user;
  }

  public async getUserWithDataById(caller: string, uuid: string) {
    const Caller = await this.repo.findOne({ where: { id: caller } });
    if (!Caller) throw BadRequestException;
    const user = await this.repo.findOne({
      where: { id: uuid },
      relations: ["user_data"],
    });
    if (!user) throw BadRequestException;

    const followed = await this.follower.isFollowed(caller, uuid);
    const response = {
      ...user,
      ...user.user_data,
      profile_picture: BIG_AVATAR.replace(
        "default",
        user.user_data.profile_picture,
      ),
      followed: followed,
    };
    return response;
  }

  public async CreateUser(user: UserDTO) {
    const payload = new User();
    payload.nickname = user.nickname;
    payload.email = user.email;
    payload.password = user.password;
    return await this.repo.save(payload);
  }

  public async DeleteUser(id: string) {
    return await this.repo.delete(id);
  }
}
