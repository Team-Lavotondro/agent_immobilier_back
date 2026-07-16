import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('')
  async getAllUser() {
    const res = this.userService.getAllUtil();
    return res;
  }

  @Get(':id')
  async getDetailUser(@Param('id') id: string) {
    const res = this.userService.getDetailUtil(id);
    return res;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const res = await this.userService.deleteUser(id);
    return res;
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() user: UpdateUtilisateurDto,
  ) {
    const res = await this.userService.updateUser(id, user);
    return res;
  }
}
