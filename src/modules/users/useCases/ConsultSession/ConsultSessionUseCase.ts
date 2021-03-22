import authConfig from '../../../../config/auth';
import { AppError } from '../../../../shared/errors/AppError';
import { ICpfValidatorProvider } from '../../../../shared/providers/CpfValidator/protocol/ICpfValidatorProvider';
import { IHashProvider } from '../../../../shared/providers/HashProvider/protocol/IHashProvider';
import { ITokenManagerProvider } from '../../../../shared/providers/TokenManager/protocol/ITokenManagerProvider';
import { IRegisterAccountRepository } from '../../repositories/protocol/IRegisterAccountRepository';

interface IUserSessionSource {
  email: string;
  cpf: string;
  cellPhone: number;
  score: number;
}

interface ITokenGeneration
  extends Omit<IUserSessionSource, 'email' | 'cellPhone'> {
  userCpf: string;
  negative: boolean;
}

interface IResponse {
  user: IUserSessionSource;
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
  }: IUserSessionSource): Promise<IResponse> {
    const isValidCpf = this.cpfValidatorProvider.isValid(cpf);

    if (!isValidCpf) {
      throw new AppError('Invalid CPF');
    }

    const user = await this.registerAccountRepository.findByEmail(email);

    if (!user) {
      const hashedCpf = await this.hashProvider.generateHash(cpf);

      const tempAccount = {
        email,
        cpf: hashedCpf,
        cellPhone,
        score: 0,
        negative: false,
      };

      const token = await this.generateToken({
        cpf,
        userCpf: tempAccount.cpf,
        score: tempAccount.score,
        negative: tempAccount.negative,
      });

      return { token, user: tempAccount };
    }

    const token = await this.generateToken({
      cpf,
      userCpf: user.cpf,
      score: user.score,
      negative: user.negative,
    });

    return { token, user };
  }

  private async generateToken({
    cpf,
    userCpf,
    score,
    negative,
  }: ITokenGeneration): Promise<string> {
    const isValidCpf = await this.hashProvider.compareHash(cpf, userCpf);

    if (!isValidCpf) {
      throw new AppError('Invalid CPF. Try again!');
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = this.tokenManagerProvider.sign({ score, negative }, secret, {
      subject: userCpf,
      expiresIn,
    });

    return token;
  }
}
