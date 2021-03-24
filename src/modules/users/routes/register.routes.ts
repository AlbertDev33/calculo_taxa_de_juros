import { Router } from 'express';

import {
  IRequest,
  IResponse,
} from '../../../shared/providers/ExpressProvider/HttpRequest';
import { makeRegisterController } from '../useCases/CreateUser';

const registerRouter = Router();

registerRouter.post('/', async (request: IRequest, response: IResponse) => {
  await makeRegisterController().handle(request, response);
});

export { registerRouter };
