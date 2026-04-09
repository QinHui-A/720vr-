/*
 * @name: Kary
 * @Date: 2025-09-21 15:28:47
 * @Description: 
 */
import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Project } from './project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],// 关联本地数据库
  controllers: [ProjectController],
  providers: [ProjectService]
})
export class ProjectModule {}
