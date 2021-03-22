import { openConnection } from '../../../modules/users/infra/typeorm';

openConnection()
  .then(async () => {
    const port = 3333;
    const app = (await import('../http/config/app')).default;

    app.listen(port, () => {
      console.info(`🚀 Executando na porta ${port}`);
    });
  })
  .catch(console.error);
