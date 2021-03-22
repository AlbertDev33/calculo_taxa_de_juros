import { CpfValidatorProvider } from '../../../../shared/providers/CpfValidator/CpfValidatorProvider';
import { BCryptHashProvider } from '../../../../shared/providers/HashProvider/BCryptHashProvider';
import { RegisterController } from '../../infra/http/controllers/RegisterController';
import { RegisterAccountRepository } from '../../repositories/implementations/RegisterAccountRepository';
import { RegisterUseCase } from './RegisterUseCase';

export const makeRegisterController = (): RegisterController => {
  const registerAccountRepository = RegisterAccountRepository.getInstance();
  const cpfValidatorProvider = new CpfValidatorProvider();
  const hashProvider = new BCryptHashProvider();
  const registerUseCase = new RegisterUseCase(
    registerAccountRepository,
    cpfValidatorProvider,
    hashProvider,
  );

  return new RegisterController(registerUseCase);
};
