/*
 * @name: Kary
 * @Date: 2025-09-20 16:48:23
 * @Description: 
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import {  } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    // 启用 CORS 并配置允许的来源
  app.enableCors({
    origin: 'http://localhost', // 允许这个来源
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 允许的 HTTP 方法
    credentials: true, // 如果需要发送 cookies 或认证信息，设为 true
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
