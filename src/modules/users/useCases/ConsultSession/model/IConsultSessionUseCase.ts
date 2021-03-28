import { IUserSessionSource, IResponseSession } from '../ConsultSessionUseCase';

export interface IConsultSessionUseCase {
  execute({
    email,
    cpf,
    cellPhone,
  }: Omit<IUserSessionSource, 'score'>): Promise<IResponseSession>;
}
