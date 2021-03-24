import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import {
  IRequest,
  IResponse,
} from '../../../shared/providers/ExpressProvider/HttpRequest';
import { makeConsultSessionController } from '../useCases/ConsultSession';

const consultSessionRouter = Router();

consultSessionRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      cpf: Joi.string().required(),
      cellPhone: Joi.number().required(),
    },
  }),
  async (request: IRequest, response: IResponse) => {
    await makeConsultSessionController().handle(request, response);
  },
);

export { consultSessionRouter };
