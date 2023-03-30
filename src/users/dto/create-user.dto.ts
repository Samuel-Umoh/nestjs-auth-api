import {
  MinLength,
  IsEmail,
  IsAlphanumeric,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(5)
  @IsAlphanumeric()
  @IsNotEmpty()
  password: string;

  @MinLength(4)
  @IsNotEmpty()
  firstName: string;

  @MinLength(4)
  @IsNotEmpty()
  lastName: string;

  @MinLength(4)
  @IsNotEmpty()
  address: string;
}
