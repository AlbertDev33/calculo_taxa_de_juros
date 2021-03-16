import { Account } from '../../infra/typeorm/schema/Account';
import { IRegisterAccountRepository } from '../../repositories/protocol/IRegisterAccountRepository';

interface IRequest {
  name: string;
  cpf: number;
  cellphone: number;
  score: number;
  negative: boolean;
}

export class RegisterUseCase {
  constructor(private registerAccountRepository: IRegisterAccountRepository) {}

  async execute({
    name,
    cpf,
    cellphone,
    score,
    negative,
  }: IRequest): Promise<Account> {
    const account = await this.registerAccountRepository.create({
      name,
      cpf,
      cellphone,
      score,
      negative,
    });

    return account;
  }
}
