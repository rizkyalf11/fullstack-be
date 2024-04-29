import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookUts } from './book-uts.entity';
import { Between, Like, Repository } from 'typeorm';
import BaseResponse from 'src/utils/response/base.response';
import {
  BookUtsDto,
  CreateBookUtsDto,
  FindBookUtsDto,
  UpdateBookUtsDeletedDto,
  UpdateBookUtsDto,
} from './bookuts.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response';

@Injectable()
export class BookUtsService extends BaseResponse {
  constructor(
    @InjectRepository(BookUts)
    private readonly bookUtsRepo: Repository<BookUts>,
  ) {
    super();
  }

  async create(payload: CreateBookUtsDto): Promise<ResponseSuccess> {
    try {
      const newBookUts = await this.bookUtsRepo.save(payload);

      console.log(payload);

      return this._success('OK', newBookUts);
    } catch (error) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: FindBookUtsDto): Promise<ResponsePagination> {
    try {
      const {
        page,
        pageSize,
        limit,
        judul,
        is_deleted,
        dari_harga,
        sampai_harga,
        deskripsi,
        penulis,
        dari_tahun_terbit,
        sampai_tahun_terbit,
        keyword,
      } = query;

      console.log(`is del ${is_deleted}`);

      const filterQuery: { [key: string]: any } = {};
      const filterKeyword = [];

      if (keyword) {
        filterKeyword.push(
          {
            judul: Like(`%${keyword}%`),
          },
          {
            penulis: Like(`%${keyword}%`),
          },
          {
            is_deleted: Like(`%${keyword}%`),
          },
        );
      } else {
        if (judul) {
          filterQuery.judul = Like(`%${judul}%`);
        }
        if (is_deleted) {
          console.log('tes');
          filterQuery.is_deleted = is_deleted == 'true' ? true : false;
        }
        if (deskripsi) {
          filterQuery.deskripsi = Like(`%${deskripsi}%`);
        }
        if (penulis) {
          filterQuery.penulis = Like(`%${penulis}%`);
        }
        if (dari_harga && sampai_harga) {
          filterQuery.harga = Between(dari_harga, sampai_harga);
        }
        if (dari_harga && !!sampai_harga === false) {
          filterQuery.harga = Between(dari_harga, dari_harga);
        }
        if (dari_tahun_terbit && sampai_tahun_terbit) {
          filterQuery.tahun_terbit = Between(
            dari_tahun_terbit,
            sampai_tahun_terbit,
          );
        }
        if (dari_tahun_terbit && !!sampai_tahun_terbit === false) {
          filterQuery.tahun_terbit = Between(
            dari_tahun_terbit,
            dari_tahun_terbit,
          );
        }
      }

      const total = await this.bookUtsRepo.count({
        where: keyword ? filterKeyword : filterQuery,
      });

      const result = await this.bookUtsRepo.find({
        where: keyword ? filterKeyword : filterQuery,
        relations: ['created_by_id', 'updated_by', 'deleted_by'],
        select: {
          id: true,
          judul: true,
          deskripsi: true,
          cover: true,
          penulis: true,
          harga: true,
          tahun_terbit: true,
          is_deleted: true,
          created_by_id: {
            id: true,
            nama: true,
          },
          updated_by: {
            id: true,
            nama: true,
          },
          deleted_by: {
            id: true,
            nama: true,
          },
        },
        skip: limit,
        take: pageSize,
      });

      return this._pagination('OK', result, total, page, pageSize);
    } catch (error) {
      console.log(error);
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async updateBookUts(
    id: number,
    updateBookUtsDto: UpdateBookUtsDto,
  ): Promise<ResponseSuccess> {
    const check = await this.bookUtsRepo.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Buku deengan id ${id} tidak ditemukan`);

    console.log(updateBookUtsDto);

    const update = await this.bookUtsRepo.save({
      ...updateBookUtsDto,
      id: id,
    });

    return this._success('Berhasil MengUpdate Data', update);
  }

  async deleteBook(
    id: number,
    updateBookUtsDto: UpdateBookUtsDeletedDto,
  ): Promise<ResponseSuccess> {
    const check = await this.bookUtsRepo.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Buku deengan id ${id} tidak ditemukan`);

    console.log(updateBookUtsDto);

    const update = await this.bookUtsRepo.save({
      ...updateBookUtsDto,
      id: id,
      is_deleted: true,
    });

    return this._success('Berhasil Menghapus Data', update);
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const check = await this.bookUtsRepo.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Buku deengan id ${id} tidak ditemukan`);

    return this._success('OK', check);
  }

  async deleteBookBack(
    id: number,
    updateBookUtsDto: UpdateBookUtsDeletedDto,
  ): Promise<ResponseSuccess> {
    const check = await this.bookUtsRepo.findOne({
      where: {
        id,
      },
      relations: ['created_by_id', 'updated_by', 'deleted_by'],
    });

    if (!check)
      throw new NotFoundException(`Buku deengan id ${id} tidak ditemukan`);

    console.log(check.created_by_id.id);
    console.log(updateBookUtsDto.deleted_by.id);

    if (check.created_by_id.id == updateBookUtsDto.deleted_by.id) {
      const update = await this.bookUtsRepo.save({
        ...updateBookUtsDto,
        id: id,
        is_deleted: false,
        deleted_by: null,
      });

      return this._success('Berhasil Mengembalikan Data', update);
    } else {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
}
