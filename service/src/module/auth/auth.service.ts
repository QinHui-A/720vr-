/*
 * @name: Kary
 * @Date: 2025-09-22 16:00:26
 * @Description: 
 */

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }
  async login(account: string, password: string) {
    const user = await this.userService.findByAccount(account)
    if (!user || user.password !== password) {
      throw new UnauthorizedException('账号或密码错误')
    }
    const token = await this.jwtService.signAsync({
      id: user.id,
      account: user.account
    })
    return token
  }
}
