import { MongoRepository, getMongoRepository } from 'typeorm';

import { InterestRateDTO } from '../../dtos/InterestRateDTO';
import { Rate } from '../../infra/typeorm/schema/Rate';
import { IInterestRateRepository } from '../protocol/IInterestRateRepository';

export class InterestRateToUnregisteredUserRepository
  implements IInterestRateRepository {
  private ormRepository: MongoRepository<Rate>;

  constructor() {
    this.ormRepository = getMongoRepository(Rate, 'mongo');
  }

  async findRateLowScore({
    type,
    installments,
  }: InterestRateDTO): Promise<number | undefined> {
    const findRates = await this.ormRepository.findOne({ type, installments });

    return findRates?.installments;
  }

  async findRateHightScore({
    type,
    installments,
  }: InterestRateDTO): Promise<number | undefined> {
    const findRates = await this.ormRepository.findOne({ type, installments });

    return findRates?.installments;
  }
}
