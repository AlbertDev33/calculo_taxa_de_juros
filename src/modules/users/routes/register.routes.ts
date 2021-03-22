import { Router, Request, Response } from 'express';

import { makeRegisterController } from '../useCases/CreateUser';

const registerRouter = Router();

registerRouter.post('/', async (request: Request, response: Response) => {
  await makeRegisterController().handle(request, response);
});

export { registerRouter };
