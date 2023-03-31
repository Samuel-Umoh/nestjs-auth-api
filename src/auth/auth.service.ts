import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Invoke from a controller, POST  / login
  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.getFullUser(email);
    if (!user) {
      return { message: 'User does not exist' };
    }
    // user bcrypt.compare
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Password does not match');
    }
    const payload = {
      email: user.email,
      sub: user._id,
      roles: user.roles[0],
    };
    // console.log('Payload username authServices', payload.username);
    // console.log('Payload roles authServices', payload.roles);
    const jwtSign = this.configService.get<string>('JWT_SIGN');

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: jwtSign,
      }),
    };
  }
}
