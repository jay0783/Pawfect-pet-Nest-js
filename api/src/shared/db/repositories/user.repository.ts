import { DateTime } from 'luxon';
import * as uuid from 'uuid';
import {
  EntityManager,
  EntityRepository,
  MoreThan,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import {
  UserEntity,
  UserPasswordRecoveryEntity,
  UserSessionEntity,
} from '../entities';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  private readonly userPasswordRecoveryRepository: Repository<UserPasswordRecoveryEntity>;

  private readonly userSessionRepository: Repository<UserSessionEntity>;

  constructor(manager: EntityManager) {
    super();
    this.userPasswordRecoveryRepository = manager.getRepository(
      UserPasswordRecoveryEntity,
    );
    this.userSessionRepository = manager.getRepository(UserSessionEntity);
  }

  async getActiveRecoveryByUserId(
    userId: string,
  ): Promise<UserPasswordRecoveryEntity | undefined> {
    const now = DateTime.utc();
    // https://github.com/typeorm/typeorm/issues/4396#issuecomment-566254087
    const userPasswordRecoveryEntity:
      | UserPasswordRecoveryEntity
      | undefined = await this.userPasswordRecoveryRepository.findOne({
      join: { alias: 'userRecovery', innerJoin: { user: 'userRecovery.user' } },
      where: (qb: SelectQueryBuilder<UserPasswordRecoveryEntity>) => {
        qb.where('user.id = :id', { id: userId })
          .andWhere('userRecovery.expireDate > :expireDate', {
            expireDate: now.toJSDate(),
          })
          .andWhere('userRecovery.isUsed = :isUsed', { isUsed: false });
      },
    });

    return userPasswordRecoveryEntity;
  }

  async getActiveRecoveryByCode(
    code: string,
  ): Promise<UserPasswordRecoveryEntity | undefined> {
    const now = DateTime.utc();
    const userPasswordRecoveryEntity:
      | UserPasswordRecoveryEntity
      | undefined = await this.userPasswordRecoveryRepository.findOne({
      where: {
        code,
        expireDate: MoreThan(now.toJSDate()),
        isUsed: false,
      },
    });

    return userPasswordRecoveryEntity;
  }

  async deactivateRecovery(
    forgotEntity: UserPasswordRecoveryEntity,
  ): Promise<UserPasswordRecoveryEntity> {
    forgotEntity.isUsed = true;
    await this.userPasswordRecoveryRepository.save(forgotEntity);
    return forgotEntity;
  }

  async createForgot(
    userEntity: UserEntity,
    code: string,
  ): Promise<UserPasswordRecoveryEntity> {
    const userForgotPass = new UserPasswordRecoveryEntity();
    userForgotPass.code = code;
    userForgotPass.user = Promise.resolve(userEntity);
    userForgotPass.expireDate = DateTime.utc()
      .plus({ minutes: 1 }) // TODO: 23.03.2021: change for prod. add to config
      .toJSDate();

    await this.userPasswordRecoveryRepository.save(userForgotPass);
    return userForgotPass;
  }

  async updateSession(userEntity: UserEntity): Promise<UserSessionEntity> {
    const userSession = (await userEntity.session) || new UserSessionEntity();

    userSession.user = Promise.resolve(userEntity);
    userSession.sessionId = uuid.v4();

    await this.userSessionRepository.save(userSession);

    return userSession;
  }
}
