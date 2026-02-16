import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const expressApp = express();
let isReady = false;

export default async function (req: any, res: any) {
  if (!isReady) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    app.enableCors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' });
    app.setGlobalPrefix('api');
    await app.init();
    isReady = true;
  }
  return expressApp(req, res);
}