import { EntityRepository, Repository } from 'typeorm';
import { NotificationFlagEntity } from '../entities';
import {
  UpsertNotificationRelations,
  UpsertNotificationOptions,
} from './update-notificationFlag.options';

@EntityRepository(NotificationFlagEntity)
export class NotificationFlagRepository extends Repository<NotificationFlagEntity> {
  async upsertNotificationFlag(
    upsertnotificationOptions: UpsertNotificationOptions,
    notificationEntity?: NotificationFlagEntity,
    relations: UpsertNotificationRelations = {},
  ): Promise<NotificationFlagEntity> {
    notificationEntity = notificationEntity || new NotificationFlagEntity();
    notificationEntity.push = true;
    if (relations.customerEntity) {
      notificationEntity.customer = Promise.resolve(relations.customerEntity);
    }
    if (relations.employeeEntity) {
      notificationEntity.employee = Promise.resolve(relations.employeeEntity);
    }
    await this.save(notificationEntity);
    return notificationEntity;
  }
}
