import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Lang } from "src/entity/lang.entity";
import { Repository } from "typeorm";

@Injectable()
export class LangService {
  constructor(
    @InjectRepository(Lang) private readonly repo: Repository<Lang>,
  ) {}
}
