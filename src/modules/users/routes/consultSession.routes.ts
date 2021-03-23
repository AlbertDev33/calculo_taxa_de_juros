import { Router, Request, Response } from 'express';

import { makeConsultSessionController } from '../useCases/ConsultSession';

const consultSessionRouter = Router();

consultSessionRouter.post('/', async (request: Request, response: Response) => {
  await makeConsultSessionController().handle(request, response);
});

export { consultSessionRouter };
