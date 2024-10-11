import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  IsStrongPassword
} from 'class-validator';

export class CreateUserValidator {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}

export class LoginUserValidator {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
