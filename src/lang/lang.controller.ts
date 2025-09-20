import { Controller } from "@nestjs/common";
import { LangService } from "./lang.service";
@Controller("lang")
export class LangController {
  constructor(private serv: LangService) {}
}
