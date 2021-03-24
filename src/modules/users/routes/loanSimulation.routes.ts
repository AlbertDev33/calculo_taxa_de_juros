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
  confirmUserAuthenticated,
  async (request: IRequest, response: IResponse) => {
    await makeLoanSimulationController().handle(request, response);
  },
);

export { loanSimulationRouter };
