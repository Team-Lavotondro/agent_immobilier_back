import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  async getAllUser() {
    const res = this.userService.getAllUtil();
    return res;
  }
  
  @Get(':id')
   async getDetailUser(@Param('id') id:string) {
    const res = this.userService.getDetailUtil(id);
    return res;
  }

}
