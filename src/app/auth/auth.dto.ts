import { PickType } from '@nestjs/mapped-types';
import { IsEmail, IsInt, IsString, Matches, MinLength } from 'class-validator';

export class UserDto {
  @IsInt()
  id: number;

  @IsString()
  nama: string;

  @IsString()
  avatar: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  refresh_token: string;

  @IsString()
  role: string;
}

export class UserGoogleDto {
  @IsString()
  id: string;

  @IsString()
  nama: string;

  @IsString()
  avatar: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  refresh_token: string;

  @IsString()
  role: string;

  @IsString()
  id_token: string;
}

export class UserUtsDto {
  @IsInt()
  id: number;

  @IsString()
  nama: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.',
  })
  password: string;

  @IsString()
  refresh_token: string;

  @IsString()
  role: string;
}

export class LoginWIthGoogleDTO extends PickType(UserGoogleDto, [
  'id',
  'nama',
  'avatar',
  'email',
  'id_token',
]) {}

export class RegisterDto extends PickType(UserDto, [
  'nama',
  'email',
  'password',
]) {}

export class RegisterUtsDto extends PickType(UserUtsDto, [
  'nama',
  'username',
  'password',
]) {}

export class LoginDto extends PickType(UserDto, ['email', 'password']) {}
export class LoginUtsDto extends PickType(UserUtsDto, [
  'username',
  'password',
]) {}

export class ResetPasswordDto {
  @IsString()
  @MinLength(8)
  new_password: string;
}
