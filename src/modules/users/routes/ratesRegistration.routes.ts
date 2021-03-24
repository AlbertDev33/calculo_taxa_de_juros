import { Router } from 'express';

import {
  IRequest,
  IResponse,
} from '../../../shared/providers/ExpressProvider/HttpRequest';
import { makeRatesRegistrationController } from '../useCases/RatesRegistration';

const ratesRegistrationRouter = Router();

ratesRegistrationRouter.post(
  '/',
  async (request: IRequest, response: IResponse) => {
    await makeRatesRegistrationController().handle(request, response);
  },
);

export { ratesRegistrationRouter };
