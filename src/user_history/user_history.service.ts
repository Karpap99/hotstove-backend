import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User_history } from 'src/entity/user_history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class User_historyService {
    constructor(@InjectRepository(User_history) private readonly repo: Repository<User_history> )
    {

    }

}
