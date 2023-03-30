import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private users = [
    {
      email: 'snow@test.com',
      password: '$2b$12$bZHKIY/6WWwhZsOPyG/tIeNVgfZNHd1iW06hIk.PTcM0DJZUC9BvG',
      id: 1680156926245,
      roles: ['USER'],
      firstName: 'snow',
      lastName: 'test',
      address: 'Uyo',
    },
    {
      email: 'Admin@test.com',
      password: '$2b$12$NjjXlBrOJJp.TO1SFVjuUOW0jvPfTwZbKGhTkpvqnOLVfLb59FAsO',
      id: 1680166534261,
      roles: ['USER'],
      firstName: 'admin',
      lastName: 'test',
      address: 'abuja',
    },
    {
      email: 'admin@dev.com',
      password: '$2b$12$qgbfftQiMO3pHOcvux/UX.yzlMxzO22VUTLihxmuWcqVV.DnQU1g6',
      firstName: 'Boma',
      lastName: 'devop',
      address: 'Nigeria',
      id: 1680188659645,
      roles: ['ADMIN'],
    },
  ];

  // invoke on a POST /signup route, refrence ninja api
  // hash password
  async create(createUserDto: CreateUserDto) {
    // check if email | username already exist
    if (this.users.some((user) => createUserDto.email === user.email)) {
      throw new HttpException(
        'User already exist, try logging in',
        HttpStatus.CONFLICT,
      );
    }
    // createUserDto.email != devAdmin@test.com, roles: ['USER']
    const hashPassword = await bcrypt.hash(createUserDto.password, 12);

    // determine new user role
    let role: string;
    switch (createUserDto.email) {
      case process.env.ADMIN_EMAIL:
        role = 'ADMIN';
        break;
      default:
        role = 'USER';
    }

    const newUser = {
      ...createUserDto,
      password: hashPassword,
      id: Date.now(),
      roles: [role],
    };
    console.log(newUser);
    this.users.push(newUser);
    return { message: 'Profile created, you can login' };
  }

  findAll() {
    // map through and return users without passwords
    //create new users Array without password
    const usersNoPassword = this.users.map(
      ({ password, ...otherFields }) => otherFields,
    );
    return usersNoPassword;
  }

  async findOne(email: string): Promise<User | undefined> {
    // scope and remove password field from object
    const user = this.users.find((user) => user.email === email);
    //create new user object without password
    const { password, ...userDataNoPassword } = user;
    return userDataNoPassword;
  }

  async getFullUser(email: string): Promise<User | undefined> {
    // scope and remove password field from object
    const user = this.users.find((user) => user.email === email);
    return user;
  }

  // req.body only has address
  // use req.user.id find a user and uppdate the address field with req.body.address
  update(email: string, updateUserDto: UpdateUserDto) {
    if (!updateUserDto.address) {
      throw new HttpException(
        'Only update your address, address should not be empty',
        HttpStatus.BAD_REQUEST,
      );
    }
    this.users = this.users.map((user) => {
      if (user.email === email) {
        return { ...user, address: updateUserDto.address };
      }
      return user;
    });
    // get address dto spread values,
    // overwrite address value, in the foundUser
    return this.findOne(email);
  }
}
