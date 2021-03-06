import { AppError } from '../../../../shared/errors/AppError';
import { ICreateInstallmentsDTO } from '../../dtos/ICreateInstallmentsDTO';
import { IInterestRateRepository } from '../../infra/typeorm/repositories/protocol/IInterestRateRepository';
import { Rate } from '../../infra/typeorm/schema/Rate';
import { IRatesRegistrationUseCase } from './model/IRatesRegistrationUseCase';

enum TypeScore {
  SCORE_BAIXO = 'SCORE_BAIXO',
  SCORE_ALTO = 'SCORE_ALTO',
}

export class RatesRegistrationUseCase implements IRatesRegistrationUseCase {
  constructor(private interasteRateRepository: IInterestRateRepository) {}

  async execute({
    type,
    installments,
    rate,
  }: ICreateInstallmentsDTO): Promise<Rate> {
    const typeMap = new Map([
      ['SCORE_BAIXO', TypeScore.SCORE_BAIXO],
      ['SCORE_ALTO', TypeScore.SCORE_ALTO],
    ]);

    if (!typeMap.has(type)) {
      throw new AppError('Invalid Type Description!');
    }

    const installmentsMap = new Map([
      [6, 6],
      [12, 12],
      [18, 18],
      [24, 24],
      [36, 36],
    ]);

    if (!installmentsMap.has(installments)) {
      throw new AppError('Invalid Installments!');
    }

    if (rate <= 0) {
      throw new AppError('Invalid rate!');
    }

    const findRate = await this.interasteRateRepository.findRate({
      type,
      installments,
      rate,
    });

    const responseInstallments = findRate?.installments;
    const responseType = findRate?.type;
    const responseRate = findRate?.rate;

    if (
      installmentsMap.has(responseInstallments as number) &&
      typeMap.has(responseType as string) &&
      responseRate === rate
    ) {
      throw new AppError('Register already exists!');
    }

    const rateAlreadyExists = await this.interasteRateRepository.findDuplicatedData(
      {
        type,
        installments,
      },
    );

    const existInstallments = rateAlreadyExists?.installments;
    const existType = rateAlreadyExists?.type;

    const isDuplicatedInstallments = new Map([
      [existInstallments, installments],
    ]);

    const isDuplicatedType = new Map([[existType, type]]);

    if (
      isDuplicatedInstallments.has(installments) &&
      isDuplicatedType.has(type)
    ) {
      throw new AppError('Installments and Type already register!');
    }

    const rates = await this.interasteRateRepository.create({
      type,
      installments,
      rate,
    });

    return rates;
  }
}
