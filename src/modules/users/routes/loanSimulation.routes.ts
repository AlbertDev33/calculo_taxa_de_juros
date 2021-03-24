import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import { confirmUserAuthenticated } from '../../../shared/infra/http/middlewares/confirmUserAuthenticated';
import {
  IRequest,
  IResponse,
} from '../../../shared/providers/ExpressProvider/HttpRequest';
import { makeLoanSimulationController } from '../useCases/LoanSimulation';

const loanSimulationRouter = Router();

loanSimulationRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      installments: Joi.number().required(),
      value: Joi.number().required(),
    },
  }),
  confirmUserAuthenticated,
  async (request: IRequest, response: IResponse) => {
    await makeLoanSimulationController().handle(request, response);
  },
);

export { loanSimulationRouter };
