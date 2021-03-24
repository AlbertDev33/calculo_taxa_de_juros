import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import {
  IRequest,
  IResponse,
} from '../../../shared/providers/ExpressProvider/HttpRequest';
import { makeRegisterController } from '../useCases/CreateUser';

const registerRouter = Router();

registerRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      cpf: Joi.string().required(),
      cellPhone: Joi.number().required(),
    },
  }),
  async (request: IRequest, response: IResponse) => {
    await makeRegisterController().handle(request, response);
  },
);

export { registerRouter };
