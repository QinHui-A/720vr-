/*
 * @name: Kary
 * @Date: 2025-09-21 15:29:04
 * @Description: 
 */
import { Body, Controller, Delete, Get, Header, Param, ParseIntPipe, Post, Put, Res } from '@nestjs/common';
import { ProjectService } from './project.service';
import { errorResponse, successResponse } from 'src/utils';
import { type Response } from 'express';
import { Public } from '../auth/public.decorator';
import archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';

@Controller('project')
export class ProjectController {

  private readonly RELEASE_PATH = path.join(process.cwd(), '', 'web-release'); // 指向 release 文件夹
  private readonly TEMP_DIR = path.join(__dirname, '../../temp'); // 临时目录（可选）

  constructor(private readonly projectService: ProjectService) { }

  @Public()
  @Get('download/:id')
  getProjectJSON(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    this.projectService.findOne(id)
      .then(config => {
        console.log(config, 'config')

        console.log('Release path:', this.RELEASE_PATH);
        console.log('Path exists:', fs.existsSync(this.RELEASE_PATH));

        // 生成 JS 脚本内容
         const jsContent = `window.PROJECT_JSON = ${JSON.stringify(config, null, 2)};`.trim();
        // 设置 ZIP 响应头
        const zipFilename = `project_${id}.zip`;
        res.header('Content-Type', 'application/zip');
        res.header('Content-Disposition', `attachment; filename="${zipFilename}"`);

        // 创建 ZIP 打包器
        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(res); // 直接输出到响应流

        // 添加 release 文件夹内容
        archive.directory(this.RELEASE_PATH, 'release');

        // 将 project_json.js 添加到 release/ 目录下
        archive.append(jsContent, { name: 'release/PROJECT_JSON.js' });

        // 结束打包
        return archive.finalize()
      })
      .catch(err => {
        console.log(err, 'err')
        return errorResponse(err.message)
      })
  }

  /*   @Public()
    @Get('download/:id')
    getProjectJSON(
      @Param('id', ParseIntPipe) id: number,
      @Res() res: Response,
    ) {
  
  
  
      this.projectService.findOne(id)
        .then(config => {
          console.log(config, 'config')
          // 生成 JS 脚本内容
          const jsContent = `window.PROJECT_JSON = ${JSON.stringify(config, null, 2)};`.trim();
          res.header('Content-Type', 'application/javascript; charset=utf-8');
          res.header('Content-Disposition', `attachment; filename="PROJECT_JSON.js"`);
          res.header('Content-Length', String(Buffer.byteLength(jsContent, 'utf-8')));
          res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.header('Pragma', 'no-cache');
          res.header('Expires', '0');
  
          // 直接返回 JS 内容
          return res.send(jsContent);
        })
        .catch(err => {
          console.log(err, 'err')
          return errorResponse(err.message)
        })
    } */


  @Post()
  async addProject(@Body() body) {
    return this.projectService.add(body)
      .then(res => {
        return successResponse(res)
      })
      .catch(err => {
        return errorResponse(err.message)
      })
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.remove(id)
      .then(res => {
        return successResponse(res)
      })
      .catch(err => {
        return errorResponse(err.message)
      })
  }

  @Put()
  edit(@Body() body) {
    return this.projectService.edit(body)
      .then(res => {
        return successResponse(res)
      })
      .catch(err => {
        return errorResponse(err.message)
      })
  }

  @Get()
  getAllProject() {
    return this.projectService.findAll()
      .then(res => {
        return successResponse(res)
      })
      .catch(err => {
        return errorResponse(err.message)
      })
  }

  @Get(':id')
  getProject(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.findOne(id)
      .then(res => {
        return successResponse(res)
      })
      .catch(err => {
        return errorResponse(err.message)
      })
  }

  /* 
    @Public()
    @Get('download:id')
    async getProjectJSON(
      @Param('id', ParseIntPipe) id: number,
      @Res() res: Response,
    ) {
      console.log(id, 'id')
      this.projectService.findOne(1)
        .then(config => {
          console.log(config, 'config')
          // 生成 JS 脚本内容
          const jsContent = `window.PROJECT_JSON = ${JSON.stringify(config, null, 2)}; `.trim();
          // 直接返回 JS 内容
          return res.send(jsContent);
        })
        .catch(err => {
          console.log(err, 'err')
          return errorResponse(err.message)
        })
  
    } */
}
