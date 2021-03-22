import { Router } from 'express';

import { registerRouter } from '../../../../modules/users/routes/register.routes';

export const router = Router();

router.use('/register', registerRouter);
