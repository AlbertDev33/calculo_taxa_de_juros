import { Request, Response } from 'express';

import { RatesRegistrationUseCase } from '../../../useCases/RatesRegistration/RatesRegistrationUseCase';

export class RatesRegistrationController {
  constructor(private ratesRegistrationUseCase: RatesRegistrationUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { type, installments, rate } = request.body;

    const rates = await this.ratesRegistrationUseCase.execute({
      type,
      installments,
      rate,
    });

    return response.status(201).json(rates);
  }
}
