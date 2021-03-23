import { Router } from 'express';

import { consultSessionRouter } from '../../../../modules/users/routes/consultSession.routes';
import { loanSimulationRouter } from '../../../../modules/users/routes/loanSimulation.routes';
import { ratesRegistrationRouter } from '../../../../modules/users/routes/ratesRegistration.routes';
import { registerRouter } from '../../../../modules/users/routes/register.routes';

export const router = Router();

router.use('/register', registerRouter);
router.use('/session', consultSessionRouter);
router.use('/loan', loanSimulationRouter);
router.use('/rates', ratesRegistrationRouter);
