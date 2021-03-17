import { AppError } from '../../../../shared/errors/AppError';
import { ICpfValidatorProvider } from '../../../../shared/providers/CpfValidator/protocol/ICpfValidatorProvider';
import { Account } from '../../infra/typeorm/schema/Account';
import { IRegisterAccountRepository } from '../../repositories/protocol/IRegisterAccountRepository';

interface IRequest {
  name: string;
  cpf: string;
  cellphone: number;
  score: number;
  negative: boolean;
}

export class RegisterUseCase {
  constructor(
    private registerAccountRepository: IRegisterAccountRepository,

    private cpfValidatorProvider: ICpfValidatorProvider,
  ) {}

  async execute({
    name,
    cpf,
    cellphone,
    score,
    negative,
  }: IRequest): Promise<Account> {
    const cpfValidator = this.cpfValidatorProvider.isValid(cpf);

    if (!cpfValidator) {
      throw new AppError('Invalid CPF', 400);
    }

    const findCpf = this.registerAccountRepository.findByCpf(cpf);

    if (findCpf.cpf === cpf) {
      throw new AppError(
        'Invalid CPF. Verify if already exist a register with this CPF',
        400,
      );
    }

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
