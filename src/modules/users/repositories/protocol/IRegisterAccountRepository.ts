import { IRegisterAccountDTO } from '../../dtos/IRegisterAccountDTO';
import { Account } from '../../infra/typeorm/schema/Account';

export interface IRegisterAccountRepository {
  create(account: IRegisterAccountDTO): Promise<Account>;
  findByCpf(account: string): Account;
}
