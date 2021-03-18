/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */
import jwt from 'jsonwebtoken';

import { AppError } from '../../../../shared/errors/AppError';
import { ICpfValidatorProvider } from '../../../../shared/providers/CpfValidator/protocol/ICpfValidatorProvider';
import { IHashProvider } from '../../../../shared/providers/HashProvider/protocol/IHashProvider';
import {
  ISignOptions,
  ITokenManagerProvider,
} from '../../../../shared/providers/TokenManager/protocol/ITokenManagerProvider';
import { IRegisterAccountDTO } from '../../dtos/IRegisterAccountDTO';
import { Account } from '../../infra/typeorm/schema/Account';
import { IRegisterAccountRepository } from '../../repositories/protocol/IRegisterAccountRepository';
import { ConsultSessionUseCase } from './ConsultSessionUseCase';

interface ISutTypes {
  sut: ConsultSessionUseCase;
  cpfValidatorStub: ICpfValidatorProvider;
  registerAccountRepositoryStub: IRegisterAccountRepository;
  hashProviderStub: IHashProvider;
  tokenManager: ITokenManagerProvider;
}

const makeCpfValidator = (): ICpfValidatorProvider => {
  class CpfValidatorStub implements ICpfValidatorProvider {
    isValid(cpf: string): boolean {
      return true;
    }
  }

  return new CpfValidatorStub();
};

const makeHash = (): IHashProvider => {
  class BCrypHashProviderStub implements IHashProvider {
    generateHash(payload: string): Promise<string> {
      payload = 'hashed_value';

      return new Promise(resolve => resolve(payload));
    }
    compareHash(payload: string, hashed: string): Promise<boolean> {
      throw new Error('Method not implemented.');
    }
  }

  return new BCrypHashProviderStub();
};

const makeTokenManager = (): ITokenManagerProvider => {
  class TokenManagerStub implements ITokenManagerProvider {
    sign(
      payload: string | object,
      expiresIn: string,
      options?: ISignOptions,
    ): string {
      return 'generateToken';
    }
    verify(token: string): string {
      return token;
    }
  }

  return new TokenManagerStub();
};

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

const makeSut = (): ISutTypes => {
  const cpfValidatorStub = makeCpfValidator();
  const registerAccountRepositoryStub = makeRegisterAccountRepository();
  const hashProviderStub = makeHash();
  const tokenManager = makeTokenManager();

  const sut = new ConsultSessionUseCase(
    cpfValidatorStub,
    registerAccountRepositoryStub,
    hashProviderStub,
    tokenManager,
  );

  return {
    sut,
    cpfValidatorStub,
    registerAccountRepositoryStub,
    hashProviderStub,
    tokenManager,
  };
};

describe('CunsultUseCase', () => {
  it('Should throw if is invalid cpf', async () => {
    const { sut, cpfValidatorStub } = makeSut();

    const fakeSession = {
      email: 'any_email@mail.com',
      cpf: '123456',
      cellPhone: 99999,
      score: 0,
    };

    jest.spyOn(cpfValidatorStub, 'isValid').mockReturnValueOnce(false);

    const session = sut.execute(fakeSession);

    await expect(session).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to create a session for an unregistered user', async () => {
    const {
      sut,
      registerAccountRepositoryStub,
      hashProviderStub,
      tokenManager,
    } = makeSut();

    const unregistered = {
      email: 'any_email@mail.com',
      cpf: '123456',
      cellPhone: 99999,
      score: 0,
    };

    const session = await sut.execute(unregistered);

    jest.spyOn(registerAccountRepositoryStub, 'findByEmail');
    jest.spyOn(hashProviderStub, 'generateHash');
    jest.spyOn(tokenManager, 'sign');

    expect(session).toEqual({
      token: 'generateToken',
      user: {
        email: 'any_email@mail.com',
        cpf: 'hashed_value',
        cellPhone: 99999,
        score: 0,
      },
    });
  });

  it('Should be able to create a session for an registered user', async () => {});
});
