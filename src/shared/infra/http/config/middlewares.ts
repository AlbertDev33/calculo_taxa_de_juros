import cors from 'cors';
import express, { Express, Request, Response, NextFunction } from 'express';

import { AppError } from '../../../errors/AppError';
import { ClientRequestError } from '../../../errors/ClientRequestError';
import { routes } from '../routes';

export default (app: Express): void => {
  app.use(cors({ origin: '*' }));
  app.use(express.json());
  app.use(routes);

  app.use(
    async (err: Error, _: Request, response: Response, __: NextFunction) => {
      if (err instanceof AppError) {
        return response.status(err.statusCode).json({
          status: 'error',
          message: err.message,
        });
      }

      console.error(err);

      if (err instanceof ClientRequestError) {
        return response.status(err.statusCode).json({
          status: 'error',
          message: err.message,
        });
      }

      return response.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    },
  );
};
