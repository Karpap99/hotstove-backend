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
     private upld: UploaderService
    )
    {

    }

    public async getPostsById(userId: string, postId: string){
        const publication = await this.repo.findOne({where: {id: postId}, relations:['creator', 'tags', 'likes', 'likes.likeBy']})
        if(!publication) throw new BadRequestException
        const formated_publications = {
            ...publication,
            likes: publication.likes.filter((like)=> like.likeBy.id == userId)
        }
        console.log(formated_publications)
        return formated_publications
    }


    public async getAll(userId: string) {
        const publications = await this.repo.find({relations:['creator', 'tags', 'likes', 'likes.likeBy']})
        const formated_publications = publications.map((publication)=>({
            ...publication,
            likes: publication.likes.filter((like)=> like.likeBy.id == userId)
        }))
        return formated_publications
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

    public async CreatePost(userId: string, dto: CreateDTO, files: Express.Multer.File[]) {
        const user = await this.users.getUserById(userId);
        if(!user) return BadRequestException
        const marking: Markingdt = JSON.parse(dto.marking) ;

        await Promise.all(files.map(async (file) => {
            if(file.originalname == 'title_picture'){
                const title_picture = await this.upld.uploadPostPhoto(file)
                dto.title_picture = title_picture.url
            } 
            else {
                const resp = await this.upld.uploadPostPhoto(file)
                marking.children = await this.SearchAndAsignImage(marking.children, {name: file.originalname, uri: resp.url})
            }
        }))
        const publication = await this.repo.save({...dto, ...{"creator": user}})
        const mrk = await this.mark.save({post: publication, marking:marking})
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

    async SearchAndAsignImage(marking: element[], file: {name: string, uri: string}){
        const mrk = marking
        mrk.map((el)=>{
            if(el.component === "Image"){
                if(el.value == file.name){
                    el.value = file.uri
                }
            }
        })
        return mrk
    }


    public async UpdatePost(userId: string) {
        
    }


   
}
