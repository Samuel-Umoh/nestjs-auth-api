import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/decorators/public.decorators';
import { Role } from './enum/role.enum';
import { Roles } from './decorators/roles.decorator';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('signup')
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('hello')
  @Roles(Role.User)
  getProfile(@Request() req) {
    // forward req.user.email|roles to service as arg
    return this.usersService.findOne(req.user.email);
  }

  // Admin only route
  @Get('all_users')
  @Roles(Role.Admin)
  findAll() {
    return this.usersService.findAll();
  }

  @Patch('update_user')
  @Roles(Role.User)
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.email, updateUserDto);
  }
}
