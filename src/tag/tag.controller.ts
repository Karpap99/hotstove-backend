import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { TagService } from "./tag.service";

@Controller("tag")
export class TagController {
  constructor(private serv: TagService) {}

  @Get()
  async getAll(@Query("q") query: string) {
    return await this.serv.getAll(query);
  }

  @Post()
  async add(@Body("tagName") tagName: string) {
    return await this.serv.addTag(tagName);
  }

  @Put()
  update() {
    return "f";
  }

  @Delete()
  delete() {
    return "";
  }
}
