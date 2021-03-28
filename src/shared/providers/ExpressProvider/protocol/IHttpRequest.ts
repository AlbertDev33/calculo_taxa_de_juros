import { IRequest, IResponse } from '../HttpRequest';

export interface IHttpRequest {
  handle(request: IRequest, response: IResponse): Promise<IRequest | IResponse>;
}
