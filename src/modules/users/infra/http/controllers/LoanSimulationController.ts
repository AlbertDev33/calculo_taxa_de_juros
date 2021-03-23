import { Request, Response } from 'express';

import { ILoanSimulationUseCase } from '../../../useCases/LoanSimulation/model/ILoanSimulationUseCase';

export class LoanSimulationController {
  constructor(private loanSimulationUseCase: ILoanSimulationUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { email, score } = request.user;
    const { installments, value } = request.body;

    const loanSimulation = await this.loanSimulationUseCase.execute({
      email,
      installments,
      value,
      score,
    });

    return response.status(201).json(loanSimulation);
  }
}
