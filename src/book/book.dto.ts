import { OmitType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min, Max, Length, IsArray, ValidateNested } from 'class-validator';
export class BookDto {
  id: number;

  @IsNotEmpty() // title tidak boleh kosong
  @Length(4, 10) // panjang karakter dari title minimal 4 dan maksimal 10
  title: string;

  @IsNotEmpty()
  author: string;

  @IsInt() // year wajib number
  @Min(2020) // minimal tahun adalah 2020
  @Max(2023) //maksimal tahun adalah 2023
  year: number;
}

export class CreateBookDto extends OmitType(BookDto, ['id']) {}
export class UpdateBookDto extends PickType(BookDto, [
  'title',
  'author',
  'year',
]) {}

export class CreateArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateArrayDto)
  data: CreateBookDto[];
}
