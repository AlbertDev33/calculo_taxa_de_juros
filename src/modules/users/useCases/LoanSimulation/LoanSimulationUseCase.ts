import { AppError } from '../../../../shared/errors/AppError';
import { IInterestRateRepository } from '../../repositories/protocol/IInterestRateRepository';
import { IRegisterAccountRepository } from '../../repositories/protocol/IRegisterAccountRepository';

interface IRequest {
  email: string;
  cpf: string;
  score: number;
  installments: number;
}

export class LoanSimulationUseCase {
  constructor(
    private registerAccountRepository: IRegisterAccountRepository,

    private interestRateRepository: IInterestRateRepository,
  ) {}

  async execute({
    email,
    cpf,
    score,
    installments,
  }: IRequest): Promise<number> {
    const user = await this.registerAccountRepository.findByEmail(email);

    if (score < 0) {
      throw new AppError('Low Score. Try again later!');
    }

    if (!user.email) {
      const type = 'SCORE_BAIXO';
      const findInterestRate = await this.interestRateRepository.findRateLowScore(
        { type, installments },
      );

      return findInterestRate;
    }

    if (user.score <= 500) {
      const type = 'SCORE_BAIXO';
      const findInterestRate = await this.interestRateRepository.findRateLowScore(
        { type, installments },
      );

      return findInterestRate;
    }

    return 1;
  }
}
