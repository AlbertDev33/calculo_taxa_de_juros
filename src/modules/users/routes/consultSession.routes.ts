import { Router } from 'express';

import {
  IRequest,
  IResponse,
} from '../../../shared/providers/ExpressProvider/HttpRequest';
import { makeConsultSessionController } from '../useCases/ConsultSession';

const consultSessionRouter = Router();

consultSessionRouter.post(
  '/',
  async (request: IRequest, response: IResponse) => {
    await makeConsultSessionController().handle(request, response);
  },
);

export { consultSessionRouter };
