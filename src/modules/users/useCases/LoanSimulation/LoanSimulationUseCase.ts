import { AppError } from '../../../../shared/errors/AppError';
import { IRegisterAccountRepository } from '../../repositories/protocol/IRegisterAccountRepository';

interface IRequest {
  email: string;
  cpf: string;
  score: number;
  negative: boolean;
  installments: number;
}

export class LoanSimulationUseCase {
  constructor(private registerAccountRepository: IRegisterAccountRepository) {}

  async execute({
    email,
    cpf,
    score,
    negative,
    installments,
  }: IRequest): Promise<object> {
    const user = await this.registerAccountRepository.findByEmail(email);

    if (!user.email) {
      if (score < 0) {
        throw new AppError('Low Score. Try again later!');
      }
    }

    return {};
  }
}
