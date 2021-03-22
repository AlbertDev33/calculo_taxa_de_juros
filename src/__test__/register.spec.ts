/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import { getConnection } from 'typeorm';

import { openConnection, disconnect } from '../modules/users/infra/typeorm';
import app from '../shared/infra/http/config/app';
import { CpfValidatorProvider } from '../shared/providers/CpfValidator/CpfValidatorProvider';

describe('Register User', () => {
  beforeAll(async () => {
    await openConnection();
  });

  afterAll(async () => {
    const connection = getConnection('mongo');
    await connection.dropDatabase();
    await disconnect();
  });

  it('Should be able to register a user', async () => {
    const mockValidationCpf = new CpfValidatorProvider();

    const response = await request(app).post('/register').send({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      cpf: '123456',
      cellPhone: 999999,
    });

    jest.spyOn(mockValidationCpf, 'isValid').mockReturnValueOnce(true);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
