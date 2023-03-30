import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { Public } from 'src/auth/decorators/public.decorators';

// can add 'auth' to controller
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  signIn(@Body(new ValidationPipe()) loginUserDto: LoginUserDto) {
    return this.authService.signIn(loginUserDto.email, loginUserDto.password);
  }
}
