import { ITransformerProvider } from '../../../../../shared/providers/ClassTransformerProvider/model/ITransformerProvider';
import {
  IRequest,
  IResponse,
} from '../../../../../shared/providers/ExpressProvider/HttpRequest';
import { IHttpRequest } from '../../../../../shared/providers/ExpressProvider/protocol/IHttpRequest';
import { IResponseSession } from '../../../useCases/ConsultSession/ConsultSessionUseCase';
import { IConsultSessionUseCase } from '../../../useCases/ConsultSession/model/IConsultSessionUseCase';

export class ConsultSessionController implements IHttpRequest {
  constructor(
    private consultSessionUseCase: IConsultSessionUseCase,

    private transformerProvider: ITransformerProvider,
  ) {}

  async handle(request: IRequest, response: IResponse): Promise<IResponse> {
    const { cpf, email, cellPhone } = request.body;

    const session = await this.consultSessionUseCase.execute({
      cpf,
      email,
      cellPhone,
    });

    return response
      .status(201)
      .json(
        this.transformerProvider.internalTransform<IResponseSession>(session),
      );
  }
}
