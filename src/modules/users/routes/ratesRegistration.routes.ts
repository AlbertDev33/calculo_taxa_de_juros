import { Router, Request, Response } from 'express';

import { makeRatesRegistrationController } from '../useCases/RatesRegistration';

const ratesRegistrationRouter = Router();

ratesRegistrationRouter.post(
  '/',
  async (request: Request, response: Response) => {
    await makeRatesRegistrationController().handle(request, response);
  },
);

export { ratesRegistrationRouter };
