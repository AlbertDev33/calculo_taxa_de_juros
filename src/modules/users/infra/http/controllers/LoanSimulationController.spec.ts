/* eslint-disable max-classes-per-file */

import { AppError } from '../../../../../shared/errors/AppError';
import { IRequestProvider } from '../../../../../shared/providers/AxiosProvider/protocol/IRequestProvider';
import {
  IRequestConfig,
  IResponse,
} from '../../../../../shared/providers/AxiosProvider/RequestProvider';
import {
  IRequest,
  IResponse as FakeIResponse,
} from '../../../../../shared/providers/ExpressProvider/HttpRequest';
import { ICreateInstallmentsDTO } from '../../../dtos/ICreateInstallmentsDTO';
import { InterestRateDTO } from '../../../dtos/InterestRateDTO';
import { IRegisterAccountDTO } from '../../../dtos/IRegisterAccountDTO';
import { LoanSimulationUseCase } from '../../../useCases/LoanSimulation/LoanSimulationUseCase';
import { IInterestRateRepository } from '../../typeorm/repositories/protocol/IInterestRateRepository';
import { IRegisterAccountRepository } from '../../typeorm/repositories/protocol/IRegisterAccountRepository';
import { Account } from '../../typeorm/schema/Account';
import { Rate } from '../../typeorm/schema/Rate';
import { LoanSimulationController } from './LoanSimulationController';

interface ISutTypes {
  sut: LoanSimulationController;
  loanSimulationUseCaseStub: LoanSimulationUseCase;
  registerAccountRepositoryStub: IRegisterAccountRepository;
  interestRateRepositoryStub: IInterestRateRepository;
  requestProviderStub: IRequestProvider;
}

const makeRequestProvider = (): IRequestProvider => {
  class RequestProviderStub implements IRequestProvider {
    post<IResponseSource>(
      url: string,
      data?: any,
      config?: IRequestConfig,
    ): Promise<IResponse<IResponseSource>> {
      const mockedReturnValueAxios = {
        numeroParcelas: 12,
        outrasTaxas: 85,
        total: 1125.0,
        valorJuros: 40.0,
        valorParcela: 93.75,
        valorSolicitado: 1000,
      };
      return new Promise(resolve =>
        resolve({ data: mockedReturnValueAxios } as IResponse),
      );
    }
  }

  return new RequestProviderStub();
};

const makeRegisterAccountRepository = (): IRegisterAccountRepository => {
  class RegisterAccountStub implements IRegisterAccountRepository {
    create(account: IRegisterAccountDTO): Promise<Account> {
      return new Promise(resolve => resolve({ ...account, id: 'valid_id' }));
    }
    findByEmail(email: string): Promise<Account | undefined> {
      return new Promise(resolve => resolve(undefined));
    }
  }

  return new RegisterAccountStub();
};

const makeInterestRateRepository = (): IInterestRateRepository => {
  class InterestRateRepositoryStub implements IInterestRateRepository {
    create(data: ICreateInstallmentsDTO): Promise<Rate> {
      return new Promise(resolve => resolve({} as Rate));
    }
    findRateLowScore({ type, installments }: InterestRateDTO): Promise<Rate> {
      return new Promise(resolve =>
        resolve({
          type: 'valid_type',
          installments: 6,
          rate: 0.04,
        } as Rate),
      );
    }
    findRateHightScore({ type, installments }: InterestRateDTO): Promise<Rate> {
      return new Promise(resolve =>
        resolve({
          type: 'valid_type',
          installments: 6,
          rate: 0.03,
        } as Rate),
      );
    }

    findRate({
      type,
      installments,
      rate,
    }: InterestRateDTO): Promise<Rate | undefined> {
      return new Promise(resolve => resolve({} as Rate));
    }

    findDuplicatedData({
      type,
      installments,
    }: InterestRateDTO): Promise<Rate | undefined> {
      return new Promise(resolve => resolve({} as Rate));
    }
  }

  return new InterestRateRepositoryStub();
};

const makeSut = (): ISutTypes => {
  const registerAccountRepositoryStub = makeRegisterAccountRepository();
  const interestRateRepositoryStub = makeInterestRateRepository();
  const requestProviderStub = makeRequestProvider();

  const loanSimulationUseCaseStub = new LoanSimulationUseCase(
    registerAccountRepositoryStub,
    interestRateRepositoryStub,
    requestProviderStub,
  );

  const sut = new LoanSimulationController(loanSimulationUseCaseStub);

  return {
    sut,
    loanSimulationUseCaseStub,
    registerAccountRepositoryStub,
    interestRateRepositoryStub,
    requestProviderStub,
  };
};

describe('Loan Simulation', () => {
  it('Should return a generic error from LoanSimulationUseCase service when the request fail before reaching the service', async () => {
    const { sut, requestProviderStub } = makeSut();

    const fakeRequest = {
      user: {
        email: 'valid_email',
        score: 10,
      },
      body: {
        installments: 6,
        value: 1000,
      },
    };

    const fakeResponse = (res?: Pick<FakeIResponse, 'json'>) => {
      return res?.json(fakeRequest);
    };

    jest
      .spyOn(requestProviderStub, 'post')
      .mockRejectedValue({ message: 'Network Error' });

    const mockSut = sut.handle(
      fakeRequest as IRequest,
      fakeResponse() as FakeIResponse,
    );

    await expect(mockSut).rejects.toThrow(
      'Unexpected error when trying to communicate to Credito Express: Network Error!',
    );
  });

  it('Should return a message error from LoanSimulationUseCase service when the invalid installments number', async () => {
    const { sut, requestProviderStub } = makeSut();

    const fakeRequest = {
      user: {
        email: 'valid_email',
        score: 10,
      },
      body: {
        installments: 16,
        value: 1000,
      },
    };

    const fakeResponse = (res?: Pick<FakeIResponse, 'json'>) => {
      return res?.json(fakeRequest);
    };

    jest.spyOn(requestProviderStub, 'post').mockRejectedValue({
      response: {
        data: 'Número de parecelas é inválida',
        status: 400,
      },
    });

    const mockSut = sut.handle(
      fakeRequest as IRequest,
      fakeResponse() as FakeIResponse,
    );

    await expect(mockSut).rejects.toBeInstanceOf(AppError);
  });

  it('Should return a message error from LoanSimulationUseCase service if any parameters are not informed', async () => {
    const { sut, requestProviderStub } = makeSut();

    const fakeRequest = {
      user: {
        email: 'valid_email',
        score: 10,
      },
      body: {
        installments: 6,
        value: 0,
      },
    };

    const fakeResponse = (res?: Pick<FakeIResponse, 'send'>) => {
      return res?.send();
    };

    jest.spyOn(requestProviderStub, 'post').mockRejectedValue({
      response: {
        data: 'Todos os parâmetros devem ser informados',
        status: 400,
      },
    });

    const mockSut = sut.handle(
      fakeRequest as IRequest,
      fakeResponse() as FakeIResponse,
    );

    await expect(mockSut).rejects.toBeInstanceOf(AppError);
  });
});
