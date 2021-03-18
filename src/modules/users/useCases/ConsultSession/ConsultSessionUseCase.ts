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

      const token = await this.generateToken(
        cpf,
        tempAccount.cpf,
        tempAccount.score,
      );

      return { token, user: tempAccount };
    }

    const token = await this.generateToken(cpf, user.cpf, user.score);

    return { token, user };
  }

  private async generateToken(
    cpf: string,
    userCpf: string,
    score: number,
  ): Promise<string> {
    await this.hashProvider.compareHash(cpf, userCpf);

    const { secret, expiresIn } = authConfig.jwt;

    const token = this.tokenManagerProvider.sign({ score }, secret, {
      subject: userCpf,
      expiresIn,
    });

    return token;
  }
}
