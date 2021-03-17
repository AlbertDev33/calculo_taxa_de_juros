import { AppError } from '../../../../shared/errors/AppError';
import { ICpfValidatorProvider } from '../../../../shared/providers/CpfValidator/protocol/ICpfValidatorProvider';
import { IHashProvider } from '../../../../shared/providers/HashProvider/protocol/IHashProvider';
import { Account } from '../../infra/typeorm/schema/Account';
import { IRegisterAccountRepository } from '../../repositories/protocol/IRegisterAccountRepository';

interface IRequest {
  name: string;
  email: string;
  cpf: string;
  cellphone: number;
  score: number;
  negative: boolean;
}

export class RegisterUseCase {
  constructor(
    private registerAccountRepository: IRegisterAccountRepository,

    private cpfValidatorProvider: ICpfValidatorProvider,

    private hashProvider: IHashProvider,
  ) {}

  async execute({
    name,
    email,
    cpf,
    cellphone,
    score,
    negative,
  }: IRequest): Promise<Account> {
    const cpfValidator = this.cpfValidatorProvider.isValid(cpf);

    if (!cpfValidator) {
      throw new AppError('Invalid CPF');
    }

    const user = await this.registerAccountRepository.findByEmail(email);

    if (user.email) {
      throw new AppError('Email already in use!');
    }

    const cpfMatched = await this.hashProvider.compareHash(cpf, user.cpf);

    if (cpfMatched) {
      throw new AppError(
        'Invalid CPF. Verify if already exist a register with this CPF',
      );
    }

    const hashedCpf = await this.hashProvider.generateHash(cpf);

    const account = await this.registerAccountRepository.create({
      name,
      email,
      cpf: hashedCpf,
      cellphone,
      score: 500,
      negative,
    });

    return account;
  }
}
