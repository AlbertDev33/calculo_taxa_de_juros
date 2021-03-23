import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../../../../config/auth';
import { AppError } from '../../../errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
  score: number;
  email: string;
}

export const confirmUserAuthenticated = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  const { secret } = authConfig.jwt;

  try {
    const decoded = verify(token, secret);

    const { sub, score, email } = decoded as ITokenPayload;

    request.user = {
      cpf: sub,
      score,
      email,
    };

    return next();
  } catch (error) {
    throw new AppError('Not authorized!', 401);
  }
};
