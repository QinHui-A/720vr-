/*
 * @name: Kary
 * @Date: 2025-09-20 16:48:23
 * @Description: 
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './module/user/user.controller';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { ProjectModule } from './module/project/project.module';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    UserModule, 
    AuthModule, 
    ProjectModule,
    TypeOrmModule.forRoot({
      type: 'mysql',                // 数据库类型
      host: 'localhost',            // 数据库地址
      port: 3306,                   // 端口
      username: 'root',             // 用户名
      password: '123456',           // 密码（你重置后的）
      database: '720vr',            // 数据库名（需提前创建）
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 自动加载实体
      synchronize: true,            // ⚠️ 开发环境设为 true，会自动同步表结构
      logging: true,                // 显示 SQL 日志
      autoLoadEntities: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
