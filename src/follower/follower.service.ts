import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follower } from 'src/entity/follower.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FollowerService {
    
    constructor(
        @InjectRepository(Follower) private readonly repo: Repository<Follower>,
        @InjectRepository(User) private readonly user: Repository<User>
        
    ){
        
    }


    async FollowOn(uuid: string, followTo: string) {
        if (uuid === followTo) throw new BadRequestException('Cannot follow yourself');

        const follower = await this.user.findOne({ where: { id: uuid } });
        if (!follower) throw new BadRequestException('Follower not found');

        const followed = await this.user.findOne({ where: { id: followTo } });
        if (!followed) throw new BadRequestException('User to follow not found');

        try {
            const payload = this.repo.create({ follower, followed });
            const result = await this.repo.save(payload);

            await this.user.increment({ id: followed.id }, 'followersCount', 1);

            return result;
        } catch (err) {
            if (err.code === '23505') {
                return;
            }
            throw err; 
        }
    }

     async UnFollowOn(uuid: string, followTo: string) {
        if (uuid === followTo) throw new BadRequestException('Cannot unfollow yourself');

        const follower = await this.user.findOne({ where: { id: uuid } });
        if (!follower) throw new BadRequestException('Follower not found');

        const followed = await this.user.findOne({ where: { id: followTo } });
        if (!followed) throw new BadRequestException('User to follow not found');

        try {
            const follow = await this.repo.findOne({where: {followed: {id:followed.id}, follower: {id: follower.id}}})
            if(!follow) throw new BadRequestException('follow not found');
            const result = await this.repo.delete(follow.id);

            await this.user.decrement({ id: followed.id }, 'followersCount', 1);

            return {'success': true};
        } catch (err) {
            if (err.code === '23505') {
                return;
            }
            throw err; 
        }
    }


}
