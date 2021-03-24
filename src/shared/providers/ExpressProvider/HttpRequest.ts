/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { Request, Response, NextFunction } from 'express';

import { IHttpRequest } from './protocol/IHttpRequest';

export interface IRequest extends Request {
  user: {
    cpf: string;
    email: string;
    score: number;
  };
}

export interface IResponse extends Response {}

export interface INextFunction extends NextFunction {}

export class HttpRequest implements IHttpRequest {
  async create(
    request: IRequest,
    response: IResponse,
  ): Promise<IRequest | IResponse> {
    return request && response;
  }
}
