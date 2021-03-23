import { Request, Response } from 'express';

import { IConsultSessionUseCase } from '../../../useCases/ConsultSession/model/IConsultSessionUseCase';

export class ConsultSessionController {
  constructor(private consultSessionUseCase: IConsultSessionUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { cpf, email, cellPhone } = request.body;

    const session = await this.consultSessionUseCase.execute({
      cpf,
      email,
      cellPhone,
    });

    return response.status(201).json(session);
  }
}
