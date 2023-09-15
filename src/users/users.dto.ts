import { OmitType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsInt } from 'class-validator';

export class UsersDto {
  id: number;

  @IsNotEmpty()
  nama: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsInt()
  umur: number;

  @IsNotEmpty()
  tanggal_lahir: string;

  @IsNotEmpty()
  status: string;
}

export class createUsersDto extends OmitType(UsersDto, ['id']) {}
export class updateUsersDto extends PickType(UsersDto, ['nama', 'status']) {}
