import { IRegisterAccountDTO } from '../../dtos/IRegisterAccountDTO';
import { Account } from '../../infra/typeorm/schema/Account';
import { IRegisterAccountRepository } from '../protocol/IRegisterAccountRepository';

export class RegisterAccountRepository implements IRegisterAccountRepository {
  private account: Account[];

  constructor() {
    this.account = [];
  }

  async create({
    name,
    cpf,
    cellphone,
    score,
    negative,
  }: IRegisterAccountDTO): Promise<Account> {
    const account = new Account();

    Object.assign(account, {
      name,
      cpf,
      cellphone,
      score,
      negative,
    });

    this.account.push(account);

    return account;
  }
}
