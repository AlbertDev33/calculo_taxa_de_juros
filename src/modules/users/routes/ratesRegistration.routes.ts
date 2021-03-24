import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import {
  IRequest,
  IResponse,
} from '../../../shared/providers/ExpressProvider/HttpRequest';
import { makeRatesRegistrationController } from '../useCases/RatesRegistration';

const ratesRegistrationRouter = Router();

ratesRegistrationRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      type: Joi.string().required(),
      installments: Joi.number().required(),
      rate: Joi.number().required(),
    },
  }),
  async (request: IRequest, response: IResponse) => {
    await makeRatesRegistrationController().handle(request, response);
  },
);

export { ratesRegistrationRouter };
