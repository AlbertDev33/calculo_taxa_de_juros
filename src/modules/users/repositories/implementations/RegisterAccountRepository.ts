import { IRegisterAccountDTO } from '../../dtos/IRegisterAccountDTO';
import { Account } from '../../infra/typeorm/schema/Account';
import { IRegisterAccountRepository } from '../protocol/IRegisterAccountRepository';

export class RegisterAccountRepository implements IRegisterAccountRepository {
  private account: Account[];

  constructor() {
    this.account = [];
  }

  async findByEmail(email: string): Promise<Account | undefined> {
    const findEmail = this.account.find(
      searchEmail => searchEmail.email === email,
    );

    return findEmail;
  }

  async create({
    name,
    email,
    cpf,
    cellPhone,
    score,
    negative,
  }: IRegisterAccountDTO): Promise<Account> {
    const account = new Account();

    Object.assign(account, {
      name,
      email,
      cpf,
      cellPhone,
      score,
      negative,
    });

    this.account.push(account);

    return account;
  }
}
