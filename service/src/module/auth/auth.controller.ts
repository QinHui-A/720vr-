/*
 * @name: Kary
 * @Date: 2025-09-21 15:18:25
 * @Description: 
 */
import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { Public } from './public.decorator';
import { AuthService } from './auth.service';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
import { errorResponse, successResponse } from 'src/utils';
import { error } from 'console';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  @UseFilters(new HttpExceptionFilter()) // 错误统一处理
  async login(@Body() body) {
    console.log(body, 'login params')
    return this.authService.login(body.account, body.password)
    .then(res => {
      return successResponse(res)
    })
    .catch(err => {
      return errorResponse(err.message)
    })
  }
}
