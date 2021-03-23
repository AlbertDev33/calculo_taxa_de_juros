import { AppError } from '../../../../shared/errors/AppError';
import { ICreateInstallmentsDTO } from '../../dtos/ICreateInstallmentsDTO';
import { IInterestRateRepository } from '../../infra/typeorm/repositories/protocol/IInterestRateRepository';
import { Rate } from '../../infra/typeorm/schema/Rate';

enum TypeScore {
  SCORE_BAIXO = 'SCORE_BAIXO',
  SCORE_ALTO = 'SCORE_ALTO',
}

export class RatesRegistrationUseCase {
  constructor(private interasteRateRepository: IInterestRateRepository) {}

  async execute({
    type,
    seis,
    doze,
    dezoito,
    vinteEquatro,
    trintaEseis,
  }: ICreateInstallmentsDTO): Promise<Rate> {
    const typeScore = {
      SCORE_BAIXO: TypeScore.SCORE_BAIXO,
      SCORE_ALTO: TypeScore.SCORE_ALTO,
    };

    if (!Object.prototype.hasOwnProperty.call(typeScore, type)) {
      throw new AppError('Invalid Type Description!');
    }

    const rates = await this.interasteRateRepository.create({
      type,
      seis,
      doze,
      dezoito,
      vinteEquatro,
      trintaEseis,
    });

    return rates;
  }
}
