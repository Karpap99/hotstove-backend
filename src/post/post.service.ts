import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post} from 'src/entity/post.entity';
import { Repository } from 'typeorm';
import { CreateDTO } from './dto/create.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entity/user.entity';
import { LikeService } from 'src/like/like.service';
import { UploaderService } from 'src/uploader/uploader.service';
import { Markingdt } from './dto/types';
import { Marking } from 'src/entity/marking.entity';
import { Tag } from '@aws-sdk/client-s3';
import { TagsService } from 'src/tags/tags.service';

type fl = {
    name: string,
    uri: string,
}

type element = {
    component: string,
    styles: Object,
    key?: string,
    value: string,
    children: element[]
}

export type post_short = {
  title?: string,
  description?: string,
  title_picture?: string,
  likes?: number,
  views?: number,
  date?: string
}

type post_response = {
    user: User,
    tags: Tag[],
    post_short?: post_short
}
@Injectable()
export class PostService {
    
    
    constructor(@InjectRepository(Post) private readonly repo: Repository<Post>, 
    @InjectRepository(Marking) private readonly mark: Repository<Marking>
    ,

     @Inject(forwardRef(() => UserService))
     private users: UserService,
     @Inject(forwardRef(() => LikeService))
     private like: LikeService,
     @Inject(forwardRef(() => UploaderService))
     private upld: UploaderService,
     @Inject(forwardRef(() => TagsService))
     private tagsSrvc: TagsService
    )
    {

    }

    public async getPostsById(userId: string, postId: string){
        const publication = await this.repo.findOne({where: {id: postId}, relations:['creator', 'tags','tags.tag',]})
        if(!publication) throw new BadRequestException
        const like = await this.like.getPostLikeByIds(userId, postId)
        const formated_publications = {
            ...publication,
            likes: like,
             tags: publication.tags.map((tag)=>{
                    return{
                        id: tag.tag.id,
                        content: tag.tag.content
                    }
                    
                })
        }
        return formated_publications
    }

    public async getPostsByUserId(uuid: any, userId: string, page: number, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [publications, total] = await this.repo.findAndCount({where: {creator:{id: userId}}, relations:['creator','creator.user_data', 'tags','tags.tag', 'likes', 'likes.likeBy'],
        skip,
        take: limit, 
        order: {
            'createDateTime': 'DESC'
        }})
        const formated = await Promise.all(publications.map( async (publication)=>{
            const like = await this.like.getPostLikeByIds(uuid, publication.id)
            await this.repo.increment({ id: publication.id }, 'views', 1);
            return {
                ...publication,
                 creator: {
                    id: publication.creator.id,
                    nickname: publication.creator.nickname,
                    profile_picture: publication.creator.user_data.profile_picture
                },
                likes: like,
                 tags: publication.tags.map((tag)=>{
                    return{
                        id: tag.tag.id,
                        content: tag.tag.content
                    }
                    })
                }
            })
        )       
        return {
            data: formated,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        };
    }


    public async getAll(userId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [publications, total] = await this.repo.findAndCount({relations:['creator','creator.user_data' , 'tags','tags.tag', 'likes', 'likes.likeBy'],
        skip,
        take: limit, 
        order: {
            'createDateTime': 'DESC'
        }})

        const formated = await Promise.all(publications.map( async (publication)=>{
            const like = await this.like.getPostLikeByIds(userId, publication.id)
            await this.repo.increment({ id: publication.id }, 'views', 1);
            return {
                ...publication,
                creator: {
                    id: publication.creator.id,
                    nickname: publication.creator.nickname,
                    profile_picture: publication.creator.user_data.profile_picture
                },
                likes: like,
                tags: publication.tags.map((tag)=>{
                    return{
                        id: tag.tag.id,
                        content: tag.tag.content
                    }
                    
                })
            }
            })
        )

        
        return {
            data: formated,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        };
    }


    public async Test( page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [publications, total] = await this.repo.findAndCount({relations:['creator','creator.user_data' , 'tags','tags.tag', 'likes', 'likes.likeBy'],
        skip,
        take: limit, 
        order: {
            'createDateTime': 'DESC'
        }})

        const formated = await Promise.all(publications.map( async (publication)=>{
            await this.repo.increment({ id: publication.id }, 'views', 1);
            return {
                ...publication,
                creator: {
                    id: publication.creator.id,
                    nickname: publication.creator.nickname,
                    profile_picture: publication.creator.user_data.profile_picture
                },
                tags: publication.tags.map((tag)=>{
                    return{
                        id: tag.tag.id,
                        content: tag.tag.content
                    }
                    
                })
            }
            })
        )

        
        return {
            data: formated,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        };
    }


    public async UpdateView(postId: string) {
        const post = await this.repo.findOneBy({id: postId})
        if(!post) return BadRequestException
        return await this.repo.save({...post, ...{views: post['views'] + 1}})
    }

    public async UpdateLike(postId: string) {
        const post = this.repo.findOneBy({id: postId})
        if(!post) return BadRequestException
        return await this.repo.save({...post, ...{views:post['likes'] + 1}})
    }

    public async CreatePost(userId: string, dto: CreateDTO, files: Express.Multer.File[], tags: string) {
        const user = await this.users.getUserById(userId);
        if(!user) throw new BadRequestException('User not found');
        
        const marking: Markingdt = JSON.parse(dto.marking) ;

        await Promise.all(files.map(async (file) => {
            const resp = await this.upld.uploadPostPhoto(file)
            if(file.originalname == 'title_picture'){
                dto.title_picture = resp.url
            } 
            else {
                marking.children = await this.SearchAndAsignImage(marking.children, {name: file.originalname, uri: resp.url})
            }
        }))
        const publication = await this.repo.save({...dto, ...{"creator": user}})
        const mrk = await this.mark.save({post: publication, marking:marking})
        if(tags != "") await this.tagsSrvc.addTags(publication.id, tags)
        return {publication, mrk}
    }


    public async DeletePost(userId: string, postId: string) {
        const user = await this.users.getUserById(userId);
        if(!user) return BadRequestException
        const post = await this.repo.findOneBy({id: postId})
        if(!post) return BadRequestException
        if(post.creator != user) return BadRequestException
        return await this.repo.delete({id: post.id})
    }

    async SearchAndAsignImage(marking: element[], file: { name: string; uri: string }): Promise<element[]> {
        const deepCopy = JSON.parse(JSON.stringify(marking));
        const assign = (elements: element[]) => {
            return elements.map(el => {
                const newEl = { ...el };
                if (newEl.component === "Image" && newEl.value === file.name) {
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
    public async UpdatePost(userId: string) {}
}
