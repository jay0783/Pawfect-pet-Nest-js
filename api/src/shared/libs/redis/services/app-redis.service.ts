import { RedisClient, createClient as createRedisClient } from 'redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TimedGeoPositionModel } from '@pawfect/models';
import { RedisConfig } from './interfaces';

@Injectable()
export class AppRedisService {
  private readonly redisClient: RedisClient;

  constructor(configService: ConfigService) {
    const redisConfig: RedisConfig = <RedisConfig>configService.get('redis');
    // this.redisClient = createRedisClient(redisConfig);
    this.redisClient = createRedisClient(6379, 'localhost');

    // this.redisClient.on("error", (error) => {
    //   console.error(error); //TODO 18.05.21: logger
    // });
  }

  async getPoints(
    employeeId: string,
    orderId: string,
  ): Promise<Array<TimedGeoPositionModel>> {
    return new Promise((res, rej) => {
      this.redisClient.get(`${orderId}-${employeeId}:points`, (err, result) => {
        if (err) {
          rej(err);
          return;
        }

        if (!result) {
          res([]);
          return;
        }

        const deserialized: Array<TimedGeoPositionModel> = <
          Array<TimedGeoPositionModel>
        >JSON.parse(result);

        res(deserialized);
        return;
      });
    });
  }

  async setPoints(
    employeeId: string,
    orderId: string,
    geoPoints: Array<TimedGeoPositionModel>,
  ): Promise<void> {
    return new Promise((res, rej) => {
      const plainObjects: Array<TimedGeoPositionModel> = geoPoints.map(
        (geoPoint) => ({
          createdAt: geoPoint.createdAt,
          lat: geoPoint.lat,
          long: geoPoint.long,
        }),
      );
      const serialized = JSON.stringify(plainObjects);

      this.redisClient.set(
        `${orderId}-${employeeId}:points`,
        serialized,
        (err, result) => {
          if (err) {
            rej(err);
            return;
          }

          res();
          return;
        },
      );
    });
  }

  async getActionPoints(
    employeeId: string,
    orderId: string,
  ): Promise<Array<TimedGeoPositionModel>> {
    return new Promise((res, rej) => {
      this.redisClient.lrange(
        `${orderId}-${employeeId}:action-points`,
        0,
        -1,
        (err, result) => {
          if (err) {
            rej(err);
            return;
          }

          const deserialized = result.map(
            (item) => <TimedGeoPositionModel>JSON.parse(item),
          );

          res(deserialized);
          return;
        },
      );
    });
  }

  async addActionPoint(
    employeeId: string,
    orderId: string,
    actionPoint: TimedGeoPositionModel,
  ): Promise<void> {
    return new Promise((res, rej) => {
      const plainObject: TimedGeoPositionModel = {
        createdAt: actionPoint.createdAt,
        lat: actionPoint.lat,
        long: actionPoint.long,
        name: actionPoint.name,
      };

      const serialized = JSON.stringify(plainObject);
      this.redisClient.rpush(
        `${orderId}-${employeeId}:action-points`,
        serialized,
        (err, result) => {
          if (err) {
            rej(err);
            return;
          }

          res();
          return;
        },
      );
    });
  }
}
