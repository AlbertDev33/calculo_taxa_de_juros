import { AppError } from '../../../../shared/errors/AppError';
import { ICpfValidatorProvider } from '../../../../shared/providers/CpfValidator/protocol/ICpfValidatorProvider';

interface IRequest {
  email: string;
  cpf: string;
  cellPhone: number;
}

export class ConsultSessionUseCase {
  constructor(private cpfValidatorProvider: ICpfValidatorProvider) {}

  async execute({ email, cpf, cellPhone }: IRequest): Promise<boolean> {
    const isValidCpf = this.cpfValidatorProvider.isValid(cpf);

    if (!isValidCpf) {
      throw new AppError('Invalid CPF');
    }

    return isValidCpf;
  }
}
