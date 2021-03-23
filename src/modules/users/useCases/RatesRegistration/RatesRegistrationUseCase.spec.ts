import { AppError } from '../../../../shared/errors/AppError';
import { ICreateInstallmentsDTO } from '../../dtos/ICreateInstallmentsDTO';
import { InterestRateDTO } from '../../dtos/InterestRateDTO';
import { IInterestRateRepository } from '../../infra/typeorm/repositories/protocol/IInterestRateRepository';
import { Rate } from '../../infra/typeorm/schema/Rate';
import { RatesRegistrationUseCase } from './RatesRegistrationUseCase';

interface ISutTypes {
  sut: RatesRegistrationUseCase;
  interestRateRepositoryStub: IInterestRateRepository;
}

const makeInterestRateRepository = (): IInterestRateRepository => {
  class InterestRateRepositoryStub implements IInterestRateRepository {
    create(data: ICreateInstallmentsDTO): Promise<Rate> {
      return new Promise(resolve =>
        resolve({
          type: 'fake_type',
          installments: 6,
          rate: 0.04,
        } as Rate),
      );
    }
    findRateLowScore({ type, installments }: InterestRateDTO): Promise<Rate> {
      return new Promise(resolve => resolve({} as Rate));
    }
    findRateHightScore({ type, installments }: InterestRateDTO): Promise<Rate> {
      return new Promise(resolve => resolve({} as Rate));
    }
  }

  return new InterestRateRepositoryStub();
};

const makeSut = (): ISutTypes => {
  const interestRateRepositoryStub = makeInterestRateRepository();

  const sut = new RatesRegistrationUseCase(interestRateRepositoryStub);

  return {
    sut,
    interestRateRepositoryStub,
  };
};

describe('Installments Registration', () => {
  it('Should be able to register rates', async () => {
    const { sut } = makeSut();

    const fakeRates = {
      type: 'fake_type',
      installments: 6,
      rate: 0.04,
    };

    const rate = { ...fakeRates, type: 'SCORE_BAIXO' };

    const response = await sut.execute(rate);

    expect(response).toEqual(fakeRates);
  });

  it('Should not be able to register rates with different type than SCORE_BAIXO or SCORE_ALTO', async () => {
    const { sut } = makeSut();

    const fakeRates = {
      id: 'valid_id',
      type: 'fake_type',
      installments: 6,
      rate: 0.04,
    };

    const response = sut.execute(fakeRates);

    await expect(response).rejects.toBeInstanceOf(AppError);
  });
});
