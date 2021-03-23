import { CpfValidatorProvider } from '../../../../shared/providers/CpfValidator/CpfValidatorProvider';
import { BCryptHashProvider } from '../../../../shared/providers/HashProvider/BCryptHashProvider';
import { TokenManagerProvider } from '../../../../shared/providers/TokenManager/TokenManagerProvider';
import { ConsultSessionController } from '../../infra/http/controllers/ConsultSessionController';
import { RegisterAccountRepository } from '../../infra/typeorm/repositories/implementations/RegisterAccountRepository';
import { ConsultSessionUseCase } from './ConsultSessionUseCase';

export const makeConsultSessionController = (): ConsultSessionController => {
  const cpfValidatorProvider = new CpfValidatorProvider();
  const registerAccountRepository = new RegisterAccountRepository();
  const bcriptHashProvider = new BCryptHashProvider();
  const tokenManagerProvider = new TokenManagerProvider();

  const consultSessionUseCase = new ConsultSessionUseCase(
    registerAccountRepository,
    cpfValidatorProvider,
    bcriptHashProvider,
    tokenManagerProvider,
  );

  return new ConsultSessionController(consultSessionUseCase);
};
