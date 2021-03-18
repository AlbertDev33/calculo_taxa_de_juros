import { sign } from 'jsonwebtoken';

import authConfig from '../../../../config/auth';
import { AppError } from '../../../../shared/errors/AppError';
import { ICpfValidatorProvider } from '../../../../shared/providers/CpfValidator/protocol/ICpfValidatorProvider';
import { IHashProvider } from '../../../../shared/providers/HashProvider/protocol/IHashProvider';
import { ITokenManagerProvider } from '../../../../shared/providers/TokenManager/protocol/ITokenManagerProvider';
import { IRegisterAccountRepository } from '../../repositories/protocol/IRegisterAccountRepository';

interface IRequest {
  email: string;
  cpf: string;
  cellPhone: number;
  score: number;
}

interface IResponse {
  user: IRequest;
  token: string;
}

export class ConsultSessionUseCase {
  constructor(
    private cpfValidatorProvider: ICpfValidatorProvider,

    private registerAccountRepository: IRegisterAccountRepository,

    private hashProvider: IHashProvider,

    private tokenManagerProvider: ITokenManagerProvider,
  ) {}

  async execute({
    email,
    cpf,
    cellPhone,
  }: IRequest): Promise<IResponse | IRequest> {
    const isValidCpf = this.cpfValidatorProvider.isValid(cpf);

    if (!isValidCpf) {
      throw new AppError('Invalid CPF');
    }

    const user = await this.registerAccountRepository.findByEmail(email);

    if (!user.email) {
      const hashedCpf = await this.hashProvider.generateHash(cpf);

      const tempAccount = {
        email,
        cpf: hashedCpf,
        cellPhone,
        score: 0,
      };

      const { secret, expiresIn } = authConfig.jwt;
      const tempScore = tempAccount.score;

      const token = this.tokenManagerProvider.sign({ tempScore }, secret, {
        subject: tempAccount.cpf,
        expiresIn,
      });

      return { token, user: tempAccount };
    }

    return user;
  }
}
