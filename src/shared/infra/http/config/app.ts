import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';

import setupMiddlewares from './middlewares';

import '@shared/infra/typeorm';

const app = express();
setupMiddlewares(app);

export default app;
