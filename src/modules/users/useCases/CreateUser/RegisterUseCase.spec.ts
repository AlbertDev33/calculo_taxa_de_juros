/* eslint-disable max-classes-per-file */
import { cpf } from 'cpf-cnpj-validator';

import { AppError } from '../../../../shared/errors/AppError';
import { ICpfValidatorProvider } from '../../../../shared/providers/CpfValidator/protocol/ICpfValidatorProvider';
import { IRegisterAccountDTO } from '../../dtos/IRegisterAccountDTO';
import { Account } from '../../infra/typeorm/schema/Account';
import { IRegisterAccountRepository } from '../../repositories/protocol/IRegisterAccountRepository';
import { RegisterUseCase } from './RegisterUseCase';

interface ISutTypes {
  sut: RegisterUseCase;
  registerAccountRepositoryStub: IRegisterAccountRepository;
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

const makeRegisterAccountRepository = (): IRegisterAccountRepository => {
  class RegisterAccountStub {
    async create(account: IRegisterAccountDTO): Promise<Account> {
      return new Promise(resolve => resolve({ ...account, id: 'valid_id' }));
    }
  }
  return new RegisterAccountStub();
};

const makeSut = (): ISutTypes => {
  const cpfValidatorStub = makeCpfValidator();
  const registerAccountRepositoryStub = makeRegisterAccountRepository();
  const sut = new RegisterUseCase(
    registerAccountRepositoryStub,
    cpfValidatorStub,
  );

  return {
    sut,
    registerAccountRepositoryStub,
    cpfValidatorStub,
  };
};

describe('Create User', () => {
  it('Sholud be able to register with valid cpf', async () => {
    const { sut, cpfValidatorStub } = makeSut();

    const fakeRegister = {
      name: 'valid_name',
      cpf: '123456',
      cellphone: 999999,
      score: 500,
      negative: false,
    };

    cpf.isValid(fakeRegister.cpf);

    const cpfValidator = jest
      .spyOn(cpfValidatorStub, 'isValid')
      .mockReturnValueOnce(true);

    const register = await sut.execute(fakeRegister);

    expect(cpfValidator).toHaveBeenCalledWith('123456');
    expect(register).toHaveProperty('id');
  });

  it('Sholud not be able to register with invalid cpf', async () => {
    const { sut, cpfValidatorStub } = makeSut();

    const fakeRegister = {
      name: 'valid_name',
      cpf: '123456',
      cellphone: 999999,
      score: 500,
      negative: false,
    };

    const cpfValidator = cpf.isValid(fakeRegister.cpf);

    jest.spyOn(cpfValidatorStub, 'isValid').mockReturnValueOnce(false);

    const register = sut.execute(fakeRegister);

    expect(cpfValidator).toBe(false);
    await expect(register).rejects.toBeInstanceOf(AppError);
  });
});
