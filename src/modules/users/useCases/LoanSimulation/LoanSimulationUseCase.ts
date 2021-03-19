import axios, { AxiosResponse } from 'axios';

import { AppError } from '../../../../shared/errors/AppError';
import { IInterestRateRepository } from '../../repositories/protocol/IInterestRateRepository';
import { IRegisterAccountRepository } from '../../repositories/protocol/IRegisterAccountRepository';

interface IRequest {
  email: string;
  cpf: string;
  score: number;
  installments: number;
  value: number;
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
    value,
  }: IRequest): Promise<AxiosResponse<IRequest>> {
    const user = await this.registerAccountRepository.findByEmail(email);

    if (score < 0) {
      throw new AppError('Low Score. Try again later!');
    }

    if (!user.email) {
      const type = 'SCORE_BAIXO';
      const findInterestRate = await this.interestRateRepository.findRateLowScore(
        { type, installments },
      );

      const response = await axios.post<IRequest>(
        'https://us-central1-creditoexpress-dev.cloudfunctions.net/teste-backend',
        {
          numeroParcelas: installments,
          valor: value,
          taxaJuros: findInterestRate,
        },
      );

      return response;
    }

    if (user.score <= 500) {
      const type = 'SCORE_BAIXO';
      const findInterestRate = await this.interestRateRepository.findRateLowScore(
        { type, installments },
      );

      const response = await axios.post<IRequest>(
        'https://us-central1-creditoexpress-dev.cloudfunctions.net/teste-backend',
        {
          numeroParcelas: installments,
          valor: value,
          taxaJuros: findInterestRate,
        },
      );

      return response;
    }

    const type = 'SCORE_ALTO';
    const findInterestRate = await this.interestRateRepository.findRateHightScore(
      { type, installments },
    );

    const response = await axios.post<IRequest>(
      'https://us-central1-creditoexpress-dev.cloudfunctions.net/teste-backend',
      {
        numeroParcelas: installments,
        valor: value,
        taxaJuros: findInterestRate,
      },
    );

    return response;
  }
}
