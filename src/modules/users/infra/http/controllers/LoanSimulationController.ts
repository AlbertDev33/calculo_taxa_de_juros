import { AppError } from '../../../../../shared/errors/AppError';
import { ClientRequestError } from '../../../../../shared/errors/ClientRequestError';
import {
  IRequest,
  IResponse,
} from '../../../../../shared/providers/ExpressProvider/HttpRequest';
import { IExpressCreditSource } from '../../../useCases/LoanSimulation/LoanSimulationUseCase';
import { ILoanSimulationUseCase } from '../../../useCases/LoanSimulation/model/ILoanSimulationUseCase';

export class LoanSimulationController {
  constructor(private loanSimulationUseCase: ILoanSimulationUseCase) {}

  async handle(request: IRequest, response: IResponse): Promise<IResponse> {
    const { email, score } = request.user;
    const { installments, value } = request.body;

    try {
      const loanSimulation = await this.loanSimulationUseCase.execute({
        email,
        installments,
        value,
        score,
      });

      return response.status(201).json(loanSimulation);
    } catch (err) {
      const installmentsMap = new Map([
        [6, 6],
        [12, 12],
        [18, 18],
        [24, 24],
        [36, 36],
      ]);

      if (!installmentsMap.has(installments)) {
        throw new AppError('Enter a valid installments', err.status);
      }

      await this.returnErrorInvalidParameters(err, {
        installments,
        value,
      });

      throw new ClientRequestError('Network Error!', err.status);
    }
  }

  private async returnErrorInvalidParameters(
    err: any,
    { installments, value, findInterestRate }: IExpressCreditSource,
  ): Promise<void> {
    if (!installments || !value) {
      throw new AppError(`${err.response.data}`, err.response.status);
    }
  }
}
