/* eslint-disable max-classes-per-file */
import { IRegisterAccountDTO } from '../../dtos/IRegisterAccountDTO';
import { Account } from '../../infra/typeorm/schema/Account';
import { IRegisterAccountRepository } from '../../repositories/protocol/IRegisterAccountRepository';
import { RegisterUseCase } from './RegisterUseCase';

interface ISutTypes {
  sut: RegisterUseCase;
  registerAccountRepositoryStub: IRegisterAccountRepository;
}

const makeRegisterAccountRepository = (): IRegisterAccountRepository => {
  class RegisterAccountStub {
    async create(account: IRegisterAccountDTO): Promise<Account> {
      return new Promise(resolve => resolve(account));
    }
  }
  return new RegisterAccountStub();
};

const makeSut = (): ISutTypes => {
  const registerAccountRepositoryStub = makeRegisterAccountRepository();
  const sut = new RegisterUseCase(registerAccountRepositoryStub);

  return {
    sut,
    registerAccountRepositoryStub,
  };
};

describe('Create User', () => {
  it('Sholud be able to register', async () => {
    const { sut } = makeSut();

    const fakeRegister = {
      name: 'valid_name',
      cpf: 123456,
      cellphone: 999999,
      score: 500,
      negative: false,
    };

    const register = await sut.execute(fakeRegister);

    expect(register).toEqual({
      name: 'valid_name',
      cpf: 123456,
      cellphone: 999999,
      score: 500,
      negative: false,
    });
  });
});
