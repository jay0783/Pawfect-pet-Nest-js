import { DateTime } from 'luxon';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { AdminEntity, AdminSessionEntity } from '../entities';

@EntityRepository(AdminEntity)
export class AdminRepository extends Repository<AdminEntity> {
  private readonly adminSessionRepository: Repository<AdminSessionEntity>;

  constructor(entityManager: EntityManager) {
    super();

    this.adminSessionRepository = entityManager.getRepository(
      AdminSessionEntity,
    );
  }

  async saveSession(
    adminEntity: AdminEntity,
    accessToken: string,
  ): Promise<AdminSessionEntity> {
    const userSession = (await adminEntity.session) || new AdminSessionEntity();

    userSession.admin = Promise.resolve(adminEntity);
    userSession.accessToken = accessToken;
    userSession.expiredRefreshDate = DateTime.utc()
      .plus({ hour: 2 })
      .toJSDate();

    await this.adminSessionRepository.save(userSession);

    return userSession;
  }
}
