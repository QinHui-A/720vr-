/*
 * @name: Kary
 * @Date: 2025-09-20 16:48:23
 * @Description: 
 */
import { Body, Controller, Get, HttpCode, Param, Post, Res } from '@nestjs/common';
import { type Response } from 'express'; // 引入 Express 的 Response 类型
import { AppService } from './app.service';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  /* 
    @Get()
    getHello(): string {
      return this.appService.getHello();
    }
  
    @Get('data/:id')
    getData(@Param() params):string {
      console.log(params, 'params')
      return 'get data：' + params.id
    }
  
    @Post('login')
    @HttpCode(200) 
    Login(@Body() data) {
      console.log(data, 'login params')
      return {
        code: 200,
        data: true
      }
    } */

}
