import app from './config/app';

const port = 3333;

app.listen(port, () => {
  console.info(`🚀 Executando na porta: ${port}`);
});
