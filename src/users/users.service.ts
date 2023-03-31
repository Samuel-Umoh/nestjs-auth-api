import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { MongoRepository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private configService: ConfigService,

    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
  ) {}

  // invoke on a POST /signup route, refrence ninja api
  // hash password
  async create(createUserDto: CreateUserDto) {
    // check if email already exist
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new HttpException(
        'User already exist, try logging in',
        HttpStatus.CONFLICT,
      );
    }
    const hashPassword = await bcrypt.hash(createUserDto.password, 12);

    // createUserDto.email != devAdmin@test.com, roles: ['USER']
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    // determine new user role
    // for stricter email comparison, dto.email === adminEmail
    const role: string = createUserDto.email.includes(adminEmail)
      ? 'ADMIN'
      : 'USER';

    const newUser = {
      ...createUserDto,
      password: hashPassword,
      roles: [role],
    };
    await this.userRepository.save(newUser);

    return { message: 'Profile created, you can login' };
  }

  async findAll(): Promise<User[] | null> {
    // exlude password fields
    const allUsers = await this.userRepository.find({
      select: ['_id', 'email', 'firstName', 'lastName', 'address', 'roles'],
    });
    return allUsers;
  }

  async findOne(email: string): Promise<User | null> {
    // exlude password field
    const user = await this.userRepository.findOne({
      where: { email: email },
      select: ['_id', 'email', 'firstName', 'lastName', 'address', 'roles'],
    });
    return user;
  }

  async getFullUser(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    return user;
  }

  // req.body only has address
  // use req.user.id find a user and uppdate the address field with req.body.address
  async update(email: string, updateUserDto: UpdateUserDto) {
    if (!updateUserDto.address) {
      throw new HttpException(
        'Only update your address, address should not be empty',
        HttpStatus.BAD_REQUEST,
      );
    }
    // update address field
    this.userRepository.findOneAndUpdate(
      { email: email },
      {
        $set: {
          address: updateUserDto.address,
        },
      },
      { upsert: true },
    );

    return this.findOne(email);
  }
}
