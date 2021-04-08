import { Connection, getConnection } from 'typeorm';

import { openConnection } from '@shared/infra/typeorm';

import { RegisterAccountRepository } from './RegisterAccountRepository';

let connection: Connection;
describe('Register Account on Mongo', () => {
  beforeAll(async () => {
    connection = await openConnection();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should return an account on success', async () => {
    const sut = new RegisterAccountRepository();

    const account = {
      name: 'John Doe',
      email: 'john@mail.com',
      cpf: '123456',
      cellPhone: 999999,
      score: 550,
      negative: false,
    };

    const accountStub = await sut.create(account);

    expect(accountStub).toBeTruthy();
    expect(accountStub.id).toBeTruthy();
    expect(accountStub.name).toBe('John Doe');
    expect(accountStub.email).toBe('john@mail.com');
  });
});
