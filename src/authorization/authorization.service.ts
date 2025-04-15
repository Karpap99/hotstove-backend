import { Injectable } from '@nestjs/common';
import { UserDTO } from 'src/user/dto/user.dto';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Verifivation } from 'src/entity/verification.entity';
@Injectable()
export class AuthorizationService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Verifivation) private readonly verifications: Repository<Verifivation> 

    ){}

    public async signUp(user: UserDTO){ 

    }

}
