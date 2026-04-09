/*
 * @name: Kary
 * @Date: 2025-09-22 15:59:21
 * @Description: 
 */

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, UseFilters } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY } from "./public.decorator";
import { Auth } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { JWT_SECRET_KEY } from "./auth.jwt.secret";
import { HttpExceptionFilter } from "src/exception/http-exception.filter";

@Injectable()
export class AuthGuar implements CanActivate {
  constructor(
    private reflector: Reflector,
    private JwtService: JwtService
  ) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('未获取到token')
    }
    try {
      const payload = await this.JwtService.verifyAsync(token, { secret: JWT_SECRET_KEY })
      console.log(payload, 'payload')
      request['user'] = payload
      return true
    } catch (error) {
      throw new UnauthorizedException(error.message)
    }
  }


}