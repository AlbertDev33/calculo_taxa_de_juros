import { Request, Response } from 'express';

import { IRegisterUseCase } from '../../../useCases/CreateUser/model/IRegisterUseCase';

export class RegisterController {
  constructor(private registerUseCase: IRegisterUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, cpf, cellPhone } = request.body;

    const register = await this.registerUseCase.execute({
      name,
      email,
      cpf,
      cellPhone,
    });

    return response.status(201).json(register);
  }
}
