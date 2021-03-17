/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */
import { AppError } from '../../../../shared/errors/AppError';
import { ICpfValidatorProvider } from '../../../../shared/providers/CpfValidator/protocol/ICpfValidatorProvider';
import { IHashProvider } from '../../../../shared/providers/HashProvider/protocol/IHashProvider';
import { IRegisterAccountDTO } from '../../dtos/IRegisterAccountDTO';
import { Account } from '../../infra/typeorm/schema/Account';
import { IRegisterAccountRepository } from '../../repositories/protocol/IRegisterAccountRepository';
import { ConsultSessionUseCase } from './ConsultSessionUseCase';

interface ISutTypes {
  sut: ConsultSessionUseCase;
  cpfValidatorStub: ICpfValidatorProvider;
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
  const sut = new ConsultSessionUseCase(cpfValidatorStub);

  return {
    sut,
    cpfValidatorStub,
  };
};

describe('CunsultUseCase', () => {
  it('Should throw if is invalid cpf', async () => {
    const { sut, cpfValidatorStub } = makeSut();

    const fakeSession = {
      cpf: '123456',
      cellPhone: 99999,
    };

    jest.spyOn(cpfValidatorStub, 'isValid').mockReturnValueOnce(false);

    const session = sut.execute(fakeSession);

    await expect(session).rejects.toBeInstanceOf(AppError);
  });
});
