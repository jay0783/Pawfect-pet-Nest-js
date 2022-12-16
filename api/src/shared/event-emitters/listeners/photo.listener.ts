import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { PhotoEntity } from '../../db/entities';
import { AwsS3Lib } from '../../libs/aws-s3';

@Injectable()
export class PhotoListener {
  constructor(
    @InjectRepository(PhotoEntity)
    private readonly photoRepository: Repository<PhotoEntity>,
    private readonly awsS3Lib: AwsS3Lib,
  ) {}

  @OnEvent('photo.delete', { async: true, promisify: true })
  async handlePhotoDeletedEvent(photoEntity: PhotoEntity): Promise<void> {
    console.log('Delete handler!');
    await this.photoRepository.remove(photoEntity);
    await this.awsS3Lib.delete(photoEntity.awsS3Key);
  }

  @OnEvent('photo.delete.many', { async: true, promisify: true })
  async handlePhotosDeletedEvent(
    photoEntities: Array<PhotoEntity>,
  ): Promise<void> {
    const deletePromises = [];
    for (const photoEntity of photoEntities) {
      deletePromises.push(
        this.photoRepository
          .remove(photoEntity)
          .then(() => this.awsS3Lib.delete(photoEntity.awsS3Key)),
      );
    }
    await Promise.all(deletePromises);
  }
}
