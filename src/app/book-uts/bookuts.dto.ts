import { OmitType, PickType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsNotEmpty,
  Min,
  Max,
  IsObject,
  IsOptional,
  IsBoolean,
  IsString,
} from 'class-validator';
import { PageRequestDto } from 'src/utils/dto/page.dto';
import { Type } from 'class-transformer';

export class BookUtsDto {
  id: number;

  @IsObject()
  @IsOptional()
  created_by_id: { id: number };

  @IsObject()
  @IsOptional()
  updated_by: { id: number };

  @IsObject()
  @IsOptional()
  deleted_by: { id: number };

  @IsBoolean()
  @IsOptional()
  is_deleted: boolean;

  @IsString()
  @IsNotEmpty()
  judul: string;

  @IsString()
  @IsNotEmpty()
  cover: string;

  @IsInt() // year wajib number
  @IsNotEmpty()
  @Min(2010) // minimal tahun adalah 2020
  @Max(2024) //maksimal tahun adalah 2023
  tahun_terbit: number;

  @IsInt()
  @IsNotEmpty()
  harga: number;

  @IsString()
  @IsNotEmpty()
  penulis: string;

  @IsString()
  @IsNotEmpty()
  deskripsi: string;
}

export class CreateBookUtsDto extends OmitType(BookUtsDto, [
  'id',
  'updated_by',
]) {}

export class UpdateBookUtsDto extends OmitType(BookUtsDto, [
  'id',
  'created_by_id',
]) {}

export class UpdateBookUtsDeletedDto extends PickType(BookUtsDto, [
  'id',
  'deleted_by',
]) {}

export class FindBookUtsDto extends PageRequestDto {
  @IsString()
  @IsOptional()
  is_deleted: string;

  @IsString()
  @IsOptional()
  judul: string;

  @IsString()
  @IsOptional()
  cover: string;

  @IsInt() // year wajib number
  @IsOptional()
  @Min(2010) // minimal tahun adalah 2020
  @Max(2024) //maksimal tahun adalah 2023
  dari_tahun_terbit: number;

  @IsInt() // year wajib number
  @IsOptional()
  @Min(2010) // minimal tahun adalah 2020
  @Max(2024) //maksimal tahun adalah 2023
  sampai_tahun_terbit: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  dari_harga: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  sampai_harga: number;

  @IsString()
  @IsOptional()
  penulis: string;

  @IsString()
  @IsOptional()
  deskripsi: string;

  @IsString()
  @IsOptional()
  keyword: string;
}
