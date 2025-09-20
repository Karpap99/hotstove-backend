import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "src/entity/tag.entity";
import { ILike, Repository } from "typeorm";

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private readonly repo: Repository<Tag>) {}

  async getAll(query: string = "") {
    const result = await this.repo.find({
      where: {
        content: ILike(`%${query}%`),
      },
      take: 3,
    });
    return result;
  }

  async addTag(tagName: string) {
    const tags = tagName.split(",");
    await Promise.all(
      tags.map(async (tag) => {
        const exist = await this.repo.findOne({
          where: { content: tag.trimStart() },
        });
        if (exist) return;
        await this.repo.save({ content: tag.trimStart() });
      }),
    );

    return "ready";
  }
}
