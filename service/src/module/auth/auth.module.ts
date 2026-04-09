/*
 * @name: Kary
 * @Date: 2025-09-21 15:18:15
 * @Description: 
 */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuar } from './auth.guard';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from './auth.jwt.secret';
@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET_KEY,
      signOptions: {
        // expiresIn: 24 * 60 * 60 * 1000
        expiresIn: 10 * 1000
      }
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuar
    }
  ]
})
export class AuthModule {}
