import axios, { AxiosResponse } from 'axios';

import { AppError } from '../../../../shared/errors/AppError';
import { IInterestRateRepository } from '../../repositories/protocol/IInterestRateRepository';
import { IRegisterAccountRepository } from '../../repositories/protocol/IRegisterAccountRepository';
import { IRequest } from '../CreateUser/RegisterUseCase';

enum TypeScore {
  SCORE_BAIXO = 'SCORE_BAIXO',
  SCORE_ALTO = 'SCORE_ALTO',
}

interface ILoanSimulationSource extends Omit<IRequest, 'name' | 'cellPhone'> {
  score: number;
  installments: number;
  value: number;
}

interface IResponse {
  numeroParcelas: number;
  outrasTaxas: number;
  total: number;
  valorJuros: number;
  valorParcela: number;
  valorSolicitado: number;
}

interface IExpressCreditSource {
  installments: number;
  value: number;
  findInterestRate: number;
}

export class LoanSimulationUseCase {
  constructor(
    private registerAccountRepository: IRegisterAccountRepository,

    private interestRateRepository: IInterestRateRepository,
  ) {}

  public async execute({
    email,
    score,
    installments,
    value,
  }: ILoanSimulationSource): Promise<AxiosResponse<IResponse>> {
    const user = await this.registerAccountRepository.findByEmail(email);

    if (score < 0) {
      throw new AppError('Low Score. Try again later!');
    }

    if (!user.email) {
      const type = TypeScore.SCORE_BAIXO;
      const findInterestRate = await this.returnFeeToLowScore(
        type,
        installments,
      );

      const response = await this.callApiCreditExpress({
        installments,
        value,
        findInterestRate,
      });

      return response;
    }

    if (user.score <= 500) {
      const type = TypeScore.SCORE_BAIXO;
      const findInterestRate = await this.returnFeeToLowScore(
        type,
        installments,
      );

      const response = await this.callApiCreditExpress({
        installments,
        value,
        findInterestRate,
      });

      return response;
    }

    const type = TypeScore.SCORE_ALTO;
    const findInterestRate = await this.interestRateRepository.findRateHightScore(
      { type, installments },
    );

    const response = await this.callApiCreditExpress({
      installments,
      value,
      findInterestRate,
    });

    return response;
  }

  private async returnFeeToLowScore(
    type: string,
    installments: number,
  ): Promise<number> {
    const findInterestRate = await this.interestRateRepository.findRateLowScore(
      { type, installments },
    );

    return findInterestRate;
  }

  private async callApiCreditExpress({
    installments,
    value,
    findInterestRate,
  }: IExpressCreditSource): Promise<AxiosResponse<IResponse>> {
    const response = await axios.post<IResponse>(
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
