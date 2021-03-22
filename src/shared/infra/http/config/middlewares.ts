import cors from 'cors';
import express, { Express, Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import { AppError } from '../../../errors/AppError';
import { ClientRequestError } from '../../../errors/ClientRequestError';
import { InternalError } from '../../../errors/InternalError';
import { router } from '../routes';

export default (app: Express): void => {
  app.use(cors({ origin: '*' }));
  app.use(express.json());
  app.use(router);

  app.use(
    async (err: Error, _: Request, response: Response, next: NextFunction) => {
      if (err instanceof AppError) {
        return response.status(err.statusCode).json({
          status: 'error',
          message: err.message,
        });
      }

      if (err instanceof ClientRequestError) {
        return response.status(err.statusCode).json({
          status: 'error',
          message: err.message,
        });
      }

      console.log(err);

      return new InternalError(err.message);
    },
  );
};
