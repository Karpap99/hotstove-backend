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
import { UserDataService } from "src/user_data/user_data.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    @Inject(forwardRef(() => UploaderService))
    private uploader: UploaderService,
    @Inject(forwardRef(() => PostService))
    private post: PostService,
    private user_data: UserDataService,
    private follower: FollowerService,
  ) {}

  public async getAll() {
    return await this.repo.find();
  }

  public async getUserById(user: string) {
    const result = await this.repo.findOne({
      where: {
        id: user,
      },
    });
    if (!result) throw new BadRequestException("No user");
    const image_scheme = `${process.env.MINIO_ENDPOINT + "/" + process.env.MINIO_BUCKET_NAME}/profile_pictures/32x32_`;
    result.user_data.profile_picture = `${image_scheme + result.user_data.profile_picture}.jpeg`
    return result;
  }

  public async getUserWithPostsAndSubscribe(requestedUser: string) {
    const user = await this.repo.findOne({ where: { id: requestedUser } });
    const error = {
      message: [""],
      error: "Bad Request",
      statusCode: 400,
    };
    if (!user) {
      error.message.push(`User with id ${requestedUser} doen't exist`);
      throw new BadRequestException(error);
    }
    const image_scheme = `${process.env.MINIO_ENDPOINT + "/" + process.env.MINIO_BUCKET_NAME}/profile_pictures/256x256_`;
    user.user_data.profile_picture = `${image_scheme + user.user_data.profile_picture}.jpeg`;
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
    const image_scheme = `${process.env.MINIO_ENDPOINT + "/" + process.env.MINIO_BUCKET_NAME}/profile_pictures/256x256_`;
    const response = {
      ...user,
      ...user.user_data,
      profile_picture: `${image_scheme + user.user_data.profile_picture}.jpeg`,
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
