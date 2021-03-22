import { InterestRateDTO } from '../../dtos/InterestRateDTO';

export interface IInterestRateRepository {
  findRateLowScore({
    type,
    installments,
  }: InterestRateDTO): Promise<number | undefined>;
  findRateHightScore({
    type,
    installments,
  }: InterestRateDTO): Promise<number | undefined>;
}
