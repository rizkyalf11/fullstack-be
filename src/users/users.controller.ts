import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/list')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post('/create')
  createUser(@Body() payload: any) {
    return this.userService.createUsers(payload);
  }

  @Put('/update/:id')
  updateUser(@Param('id') id: string, @Body() payload: any) {
    return this.userService.updateUser(Number(id), payload);
  }

  @Delete('/delete/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(Number(id));
  }

  @Get('/detail/:id')
  getDetail(@Param('id') id: string) {
    return this.userService.getDetail(Number(id));
  }
}
