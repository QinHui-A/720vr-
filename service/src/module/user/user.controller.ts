/*
 * @name: Kary
 * @Date: 2025-09-21 14:53:08
 * @Description: 
 */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { errorResponse, successResponse } from 'src/utils';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService){}
  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id)
  }
  @Get()
  async getAllUser() {
    try {
      const data = await this.userService.findAll()
      return successResponse(data)
    } catch (error) {
      return errorResponse(error.message)
    }
  }

  @Post()
  addUser(@Body() body) {
    console.log(body, '??')
    return this.userService.add(body)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
   return this.userService.remove(id)
  }
}
