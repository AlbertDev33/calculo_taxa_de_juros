import { MongoRepository, getMongoRepository } from 'typeorm';

import { ICreateInstallmentsDTO } from '../../../../dtos/ICreateInstallmentsDTO';
import { InterestRateDTO } from '../../../../dtos/InterestRateDTO';
import { Rate } from '../../schema/Rate';
import { IInterestRateRepository } from '../protocol/IInterestRateRepository';

export class InterestRateRepository implements IInterestRateRepository {
  private ormRepository: MongoRepository<Rate>;

  constructor() {
    this.ormRepository = getMongoRepository(Rate, 'mongo');
  }

  async findRateLowScore({
    type,
    installments,
  }: InterestRateDTO): Promise<Rate | undefined> {
    const findRates = await this.ormRepository.findOne({
      where: { type, installments },
    });

    return findRates;
  }

  async findRateHightScore({
    type,
    installments,
  }: InterestRateDTO): Promise<Rate | undefined> {
    const findRates = await this.ormRepository.findOne({
      where: { type, installments },
    });

    return findRates;
  }

  async create({
    type,
    seis,
    doze,
    dezoito,
    vinteEquatro,
    trintaEseis,
  }: ICreateInstallmentsDTO): Promise<Rate> {
    const rates = this.ormRepository.create({
      type,
      seis,
      doze,
      dezoito,
      vinteEquatro,
      trintaEseis,
    });

    await this.ormRepository.save(rates);

    return rates;
  }
}
