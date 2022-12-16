import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import * as uuid from 'uuid';

import { IS3Config } from '@pawfect/configs';
import { PhotoEntity } from '@pawfect/db/entities';
import { FileLib, IFileStorageClient } from './interfaces';
import { FolderEnum } from './folder.enum';
import { CompressService } from './compress.service';

@Injectable()
export class AwsS3Lib implements IFileStorageClient {
  private s3: S3;
  private s3Config: IS3Config;

  constructor(
    configService: ConfigService,
    private readonly compressService: CompressService,
  ) {
    this.s3Config = configService.get('aws-s3') as IS3Config;
    this.s3 = new S3(this.s3Config);
  }

  private async _upload(
    file: FileLib,
    folder: FolderEnum,
  ): Promise<ManagedUpload.SendData> {
    return new Promise((resolve, reject) => {
      const key = `${folder}/${uuid.v4()}-${file.originalname}`;
      this.compressService
        .compress(file)
        .then((compressedFile) => {
          this.s3.upload(
            {
              Bucket: this.s3Config.bucket,
              Key: key,
              Body: compressedFile,
            },
            (s3Err, data) => {
              if (s3Err) {
                return reject(s3Err);
              }

              return resolve(data);
            },
          );
        })
        .catch((err) => reject(err));
    });
  }

  async delete(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.s3.deleteObject(
        {
          Bucket: this.s3Config.bucket,
          Key: key,
        },
        (err, data) => {
          if (err) {
            return reject(err);
          }

          return resolve();
        },
      );
    });
  }

  async upload(file: FileLib, folder: FolderEnum): Promise<PhotoEntity> {
    const awsData: ManagedUpload.SendData = await this._upload(file, folder);
    const photoEntity: PhotoEntity = new PhotoEntity();
    photoEntity.url = awsData.Location;
    photoEntity.awsS3Key = awsData.Key;

    return photoEntity;
  }
}
