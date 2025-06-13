import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follower } from 'src/entity/follower.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FollowerService {
    constructor(@InjectRepository(Follower) private readonly repo: Repository<Follower>){}

}
