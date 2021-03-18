import { InterestRateDTO } from '../../dtos/InterestRateDTO';

export interface IInterestRateRepository {
  findRateLowScore({ type, installments }: InterestRateDTO): Promise<number>;
  findRateHightScore({ type, installments }: InterestRateDTO): Promise<number>;
}
