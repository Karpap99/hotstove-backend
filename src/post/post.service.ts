import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "src/entity/post.entity";
import { ILike, In, Repository } from "typeorm";
import { CreateDTO } from "./dto/create.dto";
import { UserService } from "src/user/user.service";
import { LikeService } from "src/like/like.service";
import { UploaderService } from "src/uploader/uploader.service";
import { Markingdt } from "./dto/types";
import { Marking } from "src/entity/marking.entity";
import { TagsService } from "src/tags/tags.service";
import { FollowerService } from "src/follower/follower.service";

type element = {
  component: string;
  styles: object;
  key?: string;
  value: string;
  children: element[];
};

export type post_short = {
  title?: string;
  description?: string;
  title_picture?: string;
  likes?: number;
  views?: number;
  date?: string;
};

@Injectable()
export class PostService {
  UpdatePost() {
    throw new Error("Method not implemented.");
  }
  constructor(
    @InjectRepository(Post) private readonly repo: Repository<Post>,
    @InjectRepository(Marking) private readonly mark: Repository<Marking>,
    @Inject(forwardRef(() => UserService)) private users: UserService,
    @Inject(forwardRef(() => LikeService)) private like: LikeService,
    @Inject(forwardRef(() => UploaderService)) private upld: UploaderService,
    @Inject(forwardRef(() => TagsService)) private tagsSrvc: TagsService,
    @Inject(forwardRef(() => FollowerService))
    private follower: FollowerService,
  ) {}

  async getLikedPosts(uuid: string) {
    const [postIds, likes] = await this.like.GetLikedPosts(uuid);

    if (!postIds || postIds.length === 0)
      throw new BadRequestException("No liked posts found");

    const publications = await this.repo.find({
      where: { id: In(postIds) },
      relations: ["creator", "creator.user_data", "tags", "tags.tag"],
    });
    const image_scheme = `${process.env.MINIO_ENDPOINT + "/" + process.env.MINIO_BUCKET_NAME}/profile_pictures/32x32_`;
    const formatedPublications = publications.map((publication) => {
      return {
        ...publication,
        likes: likes.filter((like) => like.post.id === publication.id),
        tags: publication.tags.map((tag) => ({
          id: tag.tag.id,
          content: tag.tag.content,
        })),
        creator: {
          id: publication.creator.id,
          nickname: publication.creator.nickname,
          profile_picture: `${image_scheme + publication.creator.user_data.profile_picture}.jpeg`,
        },
      };
    });
    return { data: formatedPublications };
  }

  public async getPostsById(userId: string, postId: string) {
    const publication = await this.repo.findOne({
      where: { id: postId },
      relations: ["creator", "creator.user_data", "tags", "tags.tag"],
    });
    if (!publication) throw new BadRequestException();
    const like = await this.like.getPostLikeByIds(userId, postId);
    const image_scheme = `${process.env.MINIO_ENDPOINT + "/" + process.env.MINIO_BUCKET_NAME}/profile_pictures/32x32_`;
    const formated_publications = {
      ...publication,
      likes: like,
      tags: publication.tags.map((tag) => {
        return {
          id: tag.tag.id,
          content: tag.tag.content,
        };
      }),
      creator: {
        id: publication.creator.id,
        nickname: publication.creator.nickname,
        profile_picture: `${image_scheme + publication.creator.user_data.profile_picture}.jpeg`,
      },
    };
    return formated_publications;
  }

  public async getPostsByIdWithMarking(userId: string, postId: string) {
    const publication = await this.repo.findOne({
      where: { id: postId },
      relations: [
        "creator",
        "creator.user_data",
        "tags",
        "tags.tag",
        "marking",
      ],
    });
    if (!publication) throw new BadRequestException();
    const like = await this.like.getPostLikeByIds(userId, postId);
    const image_scheme = `${process.env.MINIO_ENDPOINT + "/" + process.env.MINIO_BUCKET_NAME}/profile_pictures/32x32_`;

    const formated_publications = {
      ...publication,
      likes: like,
      tags: publication.tags.map((tag) => {
        return {
          id: tag.tag.id,
          content: tag.tag.content,
        };
      }),
      creator: {
        id: publication.creator.id,
        nickname: publication.creator.nickname,
        profile_picture: `${image_scheme + publication.creator.user_data.profile_picture}.jpeg`,
      },
    };
    return formated_publications;
  }

  async ByUserAndFollowed(uuid: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const followed = await this.follower.FollowedByUser(uuid);
    const followedIds = followed.map((f) => f.id);
    const [publications, total] = await this.repo.findAndCount({
      where: { creator: In(followedIds) },
      relations: [
        "creator",
        "creator.user_data",
        "tags",
        "tags.tag",
        "likes",
        "likes.likeBy",
      ],
      skip,
      take: limit,
      order: {
        createDateTime: "DESC",
      },
    });
    const image_scheme = `${process.env.MINIO_ENDPOINT + "/" + process.env.MINIO_BUCKET_NAME}/profile_pictures/32x32_`;
    const formated = await Promise.all(
      publications.map(async (publication) => {
        const like = await this.like.getPostLikeByIds(uuid, publication.id);
        await this.repo.increment({ id: publication.id }, "views", 1);
        return {
          ...publication,
          creator: {
            id: publication.creator.id,
            nickname: publication.creator.nickname,
            profile_picture: `${image_scheme + publication.creator.user_data.profile_picture}.jpeg`,
          },
          likes: like,
          tags: publication.tags.map((tag) => {
            return {
              id: tag.tag.id,
              content: tag.tag.content,
            };
          }),
        };
      }),
    );
    return {
      data: formated,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async getPostsByUserId(
    uuid: any,
    userId: string,
    page: number,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const [publications, total] = await this.repo.findAndCount({
      where: { creator: { id: userId } },
      relations: [
        "creator",
        "creator.user_data",
        "tags",
        "tags.tag",
        "likes",
        "likes.likeBy",
      ],
      skip,
      take: limit,
      order: {
        createDateTime: "DESC",
      },
    });
    const image_scheme = `${process.env.MINIO_ENDPOINT + "/" + process.env.MINIO_BUCKET_NAME}/profile_pictures/32x32_`;
    const formated = await Promise.all(
      publications.map(async (publication) => {
        const like = await this.like.getPostLikeByIds(uuid, publication.id);
        await this.repo.increment({ id: publication.id }, "views", 1);
        return {
          ...publication,
          creator: {
            id: publication.creator.id,
            nickname: publication.creator.nickname,
            profile_picture: `${image_scheme + publication.creator.user_data.profile_picture}.jpeg`,
          },
          likes: like,
          tags: publication.tags.map((tag) => {
            return {
              id: tag.tag.id,
              content: tag.tag.content,
            };
          }),
        };
      }),
    );
    return {
      data: formated,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async getAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
    query: string,
  ) {
    const skip = (page - 1) * limit;
    const [publications, total] = await this.repo.findAndCount({
      where: { title: ILike(`%${query}%`) },
      relations: [
        "creator",
        "creator.user_data",
        "tags",
        "tags.tag",
        "likes",
        "likes.likeBy",
      ],
      skip,
      take: limit,
      order: {
        createDateTime: "DESC",
      },
    });
    const image_scheme = `${process.env.MINIO_ENDPOINT + "/" + process.env.MINIO_BUCKET_NAME}/profile_pictures/32x32_`;

    const formated = await Promise.all(
      publications.map(async (publication) => {
        const like = await this.like.getPostLikeByIds(userId, publication.id);
        await this.repo.increment({ id: publication.id }, "views", 1);
        return {
          ...publication,
          creator: {
            id: publication.creator.id,
            nickname: publication.creator.nickname,
            profile_picture: `${image_scheme + publication.creator.user_data.profile_picture}.jpeg`,
          },
          likes: like,
          tags: publication.tags.map((tag) => {
            return {
              id: tag.tag.id,
              content: tag.tag.content,
            };
          }),
        };
      }),
    );

    return {
      data: formated,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async getTitles(
    page: number = 1,
    limit: number = 10,
    query: string = "",
  ) {
    const [publications, total] = await this.repo.findAndCount({
      where: { title: ILike(`%${query}%`) },
      take: limit,
    });

    const formated = await Promise.all(
      publications.map((publication) => {
        return {
          title: publication.title,
        };
      }),
    );

    return {
      data: formated,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async Test(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [publications, total] = await this.repo.findAndCount({
      relations: [
        "creator",
        "creator.user_data",
        "tags",
        "tags.tag",
        "likes",
        "likes.likeBy",
      ],
      skip,
      take: limit,
      order: {
        createDateTime: "DESC",
      },
    });

    const image_scheme = `${process.env.MINIO_ENDPOINT + "/" + process.env.MINIO_BUCKET_NAME}/profile_pictures/32x32_`;

    const formated = await Promise.all(
      publications.map(async (publication) => {
        await this.repo.increment({ id: publication.id }, "views", 1);
        return {
          ...publication,
          creator: {
            id: publication.creator.id,
            nickname: publication.creator.nickname,
            profile_picture: `${image_scheme + publication.creator.user_data.profile_picture}.jpeg`,
          },
          tags: publication.tags.map((tag) => {
            return {
              id: tag.tag.id,
              content: tag.tag.content,
            };
          }),
        };
      }),
    );

    return {
      data: formated,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async UpdateView(postId: string) {
    const post = await this.repo.findOneBy({ id: postId });
    if (!post) return BadRequestException;
    return await this.repo.save({ ...post, ...{ views: post.views + 1 } });
  }

  public async UpdateLike(postId: string) {
    const post = await this.repo.findOneBy({ id: postId });
    if (!post) return BadRequestException;
    return await this.repo.save({
      ...post,
      ...{ likesCount: post.likeCount + 1 },
    });
  }

  public async CreatePost(
    userId: string,
    dto: CreateDTO,
    files: Express.Multer.File[],
    tags: string,
  ) {
    const user = await this.users.getUserById(userId);
    if (!user) throw new BadRequestException("User not found");

    let marking: Markingdt;
    try {
      marking = JSON.parse(dto.marking) as Markingdt;
    } catch (e) {
      Logger.log(e);
      throw new BadRequestException("Invalid marking JSON");
    }

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const resp = await this.upld.uploadPostFile(file);
        return { file, url: resp.url };
      }),
    );

    const titlePic = uploadResults.find(
      (res) => res.file.originalname === "title_picture",
    );
    if (titlePic) {
      dto.title_picture = titlePic.url;
    }
    for (const { file, url } of uploadResults) {
      if (file.originalname !== "title_picture") {
        marking.children = this.SearchAndAsignImage(marking.children, {
          name: file.originalname,
          uri: url,
        });
      }
    }

    const publication = await this.repo.save({
      ...CreateDTO.WithoutMarking(dto),
      creator: user,
    });

    const mrk = await this.mark.save({
      post: publication,
      marking,
    });

    if (tags && tags.trim()) {
      this.tagsSrvc.addTags(publication.id, tags);
    }

    return { publication, mrk };
  }

  public async DeletePost(userId: string, postId: string) {
    const user = await this.users.getUserById(userId);
    if (!user) return BadRequestException;
    const post = await this.repo.findOne({
      where: { id: postId },
      relations: ["creator"],
    });
    if (!post) return BadRequestException;
    if (post.creator.id != userId) return BadRequestException;
    return await this.repo.delete({ id: post.id });
  }

  SearchAndAsignImage(
    marking: element[],
    file: { name: string; uri: string },
  ): element[] {
    const deepCopy = structuredClone(marking);
    const assign = (elements: element[]) => {
      return elements.map((el) => {
        const newEl = { ...el };
        if (
          (newEl.component === "Image" || newEl.component === "Video") &&
          newEl.value === file.name
        ) {
          newEl.value = file.uri;
        }
        if (newEl.children && Array.isArray(newEl.children)) {
          newEl.children = assign(newEl.children);
        }
        return newEl;
      });
    };
    return assign(deepCopy);
  }
}
