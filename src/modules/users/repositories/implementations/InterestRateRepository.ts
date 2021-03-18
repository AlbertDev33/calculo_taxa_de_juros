import { InterestRateDTO } from '../../dtos/InterestRateDTO';
import { Rate } from '../../infra/typeorm/schema/Rate';
import { IInterestRateRepository } from '../protocol/IInterestRateRepository';

export class InterestRateToUnregisteredUserRepository
  implements IInterestRateRepository {
  private rates: Rate[];

  constructor() {
    this.rates = [];
  }

  async findRateLowScore({
    type,
    installments,
  }: InterestRateDTO): Promise<number> {
    const findRates = this.rates.find(
      rate => rate.installments === installments && rate.type === type,
    );

    return findRates.installments;
  }

  async findRateHightScore({
    type,
    installments,
  }: InterestRateDTO): Promise<number> {
    const findRates = this.rates.find(
      rate => rate.installments === installments && rate.type === type,
    );

    return findRates.installments;
  }
}
