import { createConnection, Connection } from 'typeorm';

const closeConnection = new Connection({ type: 'mongodb' });

export const openConnection = async (
  host = 'localhost',
): Promise<Connection> => {
  return createConnection({
    type: 'mongodb',
    host: process.env.NODE_ENV === 'test' ? 'localhost' : host,
    port: 27017,
    entities: ['./src/modules/users/infra/typeorm/schema/*.ts'],
    useUnifiedTopology: true,
    database:
      process.env.NODE_ENV === 'test'
        ? 'credito_express_test'
        : 'creditExpress',
  });
};

export const disconnect = (): Promise<void> => closeConnection.close();
