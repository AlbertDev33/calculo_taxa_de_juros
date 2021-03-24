import {
  IRequest,
  IResponse,
} from '../../../../../shared/providers/ExpressProvider/HttpRequest';
import { IRegisterUseCase } from '../../../useCases/CreateUser/model/IRegisterUseCase';

export class RegisterController {
  constructor(private registerUseCase: IRegisterUseCase) {}

  async handle(request: IRequest, response: IResponse): Promise<IResponse> {
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
