/* eslint-disable max-classes-per-file */
import { AppError } from '../../../../shared/errors/AppError';
import { InterestRateDTO } from '../../dtos/InterestRateDTO';
import { IRegisterAccountDTO } from '../../dtos/IRegisterAccountDTO';
import { Account } from '../../infra/typeorm/schema/Account';
import { Rate } from '../../infra/typeorm/schema/Rate';
import { IInterestRateRepository } from '../../repositories/protocol/IInterestRateRepository';
import { IRegisterAccountRepository } from '../../repositories/protocol/IRegisterAccountRepository';
import { LoanSimulationUseCase } from './LoanSimulationUseCase';

interface ISutTypes {
  sut: LoanSimulationUseCase;
  registerAccountRepositoryStub: IRegisterAccountRepository;
  interestRateRepositoryStub: IInterestRateRepository;
}

const makeRegisterAccountRepository = (): IRegisterAccountRepository => {
  class RegisterAccountStub implements IRegisterAccountRepository {
    create(account: IRegisterAccountDTO): Promise<Account> {
      return new Promise(resolve => resolve({ ...account, id: 'valid_id' }));
    }
    findByEmail(email: string): Promise<Account> {
      return new Promise(resolve => resolve({} as Account));
    }
  }

  return new RegisterAccountStub();
};

const makeInterestRateRepository = (): IInterestRateRepository => {
  class InterestRateRepositoryStub implements IInterestRateRepository {
    findRateLowScore({ type, installments }: InterestRateDTO): Promise<number> {
      return new Promise(resolve => resolve(0.055));
    }
    findRateHightScore({
      type,
      installments,
    }: InterestRateDTO): Promise<number> {
      return new Promise(resolve => resolve(0.04));
    }
  }

  return new InterestRateRepositoryStub();
};

const makeSut = (): ISutTypes => {
  const registerAccountRepositoryStub = makeRegisterAccountRepository();
  const interestRateRepositoryStub = makeInterestRateRepository();

  const sut = new LoanSimulationUseCase(
    registerAccountRepositoryStub,
    interestRateRepositoryStub,
  );

  return {
    sut,
    registerAccountRepositoryStub,
    interestRateRepositoryStub,
  };
};

describe('Loan Simulation', () => {
  it('Should throw if user is negative', async () => {
    const { sut } = makeSut();

    const fakeAccount = {
      email: 'any_email@mail.com',
      cpf: '123456',
      score: -1,
      installments: 6,
    };

    const loanSimulation = sut.execute(fakeAccount);

    await expect(loanSimulation).rejects.toBeInstanceOf(AppError);
  });

  it('Should verify interest rates for an unregistered user', async () => {
    const { sut } = makeSut();

    const fakeAccount = {
      email: 'any_email@mail.com',
      cpf: '123456',
      score: 0,
      negative: false,
      installments: 6,
    };

    const loanSimulation = await sut.execute(fakeAccount);

    expect(loanSimulation).toEqual(0.055);
  });
});
