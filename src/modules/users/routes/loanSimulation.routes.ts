import { Router, Request, Response } from 'express';

import { confirmUserAuthenticated } from '../../../shared/infra/http/middlewares/confirmUserAuthenticated';
import { makeLoanSimulationController } from '../useCases/LoanSimulation';

const loanSimulationRouter = Router();

loanSimulationRouter.post(
  '/',
  confirmUserAuthenticated,
  async (request: Request, response: Response) => {
    await makeLoanSimulationController().handle(request, response);
  },
);

export { loanSimulationRouter };
