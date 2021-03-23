import { ICreateInstallmentsDTO } from '../../../../dtos/ICreateInstallmentsDTO';
import { InterestRateDTO } from '../../../../dtos/InterestRateDTO';
import { Rate } from '../../schema/Rate';

export interface IInterestRateRepository {
  create({
    type,
    seis,
    doze,
    dezoito,
    vinteEquatro,
    trintaEseis,
  }: ICreateInstallmentsDTO): Promise<Rate>;
  findRateLowScore({
    type,
    installments,
  }: InterestRateDTO): Promise<Rate | undefined>;
  findRateHightScore({
    type,
    installments,
  }: InterestRateDTO): Promise<Rate | undefined>;
}
