import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class UploaderService {
    private client: S3Client;
    private bucketName;

    constructor(private readonly configService: ConfigService) 
    {
        this.bucketName = this.configService.get('S3_BUCKET_NAME')
        const s3_region = this.configService.get('S3_REGION')
        const accessKey = this.configService.get('S3_ACCESS_KEY')
        const secretAccessKey = this.configService.get('S3_SECRET_ACCESS_KEY')
        if(!s3_region || !accessKey || !secretAccessKey) throw new Error('not found')
        this.client = new S3Client({
            region: s3_region,
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey: secretAccessKey,
            },
            forcePathStyle: true,
        });
    }

    async uploadPostPhoto(file: Express.Multer.File) {
      const key = `post_pictures/${uuidv4()}`;
      try {
        const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL:  'public-read',
        Metadata: {
          originalName: file.originalname,
        },
      });
      await this.client.send(command);
      return {
        url:  `https://${this.bucketName}.s3.amazonaws.com/${key}`
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }


  async uploadProfilePhoto({
        file,
        isPublic = true,
    }: {
        file: Express.Multer.File;
        isPublic: boolean;
    }) {

      try {
            const key = `${uuidv4()}`;
            const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: "profile_pictures/" + key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: isPublic ? 'public-read' : 'private',
            Metadata: {
                originalName: file.originalname,
            },
      });
 
      const uploadResult = await this.client.send(command);

      return {
        url: isPublic
          ? (await this.getPfpUrl(key)).url
          : (await this.getPresignedSignedUrl(key)).url,
        key,
        isPublic,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  
 
  async getPfpUrl(key: string) {
    return { url: `https://${this.bucketName}.s3.amazonaws.com/profile_pictures/${key}` };
  }

  async getFileUrl(key: string) {
    return { url: `https://${this.bucketName}.s3.amazonaws.com/${key}` };
  }
 
 
 async getPresignedSignedUrl(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
 
      const url = await getSignedUrl(this.client, command, {
        expiresIn: 60 * 60 * 24, // 24 hours
      });
 
      return { url };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteFile(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
 
      await this.client.send(command);
 
      return { message: 'File deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

}
