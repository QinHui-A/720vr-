import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],// 关联本地数据库
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
