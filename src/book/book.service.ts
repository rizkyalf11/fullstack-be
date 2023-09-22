import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateArrayDto,
  CreateBookDto,
  DeleteArrayDto,
  FindBookDto,
  UpdateBookDto,
} from './book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Between, Like, Repository } from 'typeorm';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {}

  async getAllBooks(query: FindBookDto): Promise<ResponsePagination> {
    const { page, pageSize, limit, author, from_year, title, to_year } = query;
    console.log('uqwey', query);
    const total = await this.bookRepository.count();

    const filter: { [title: string]: any } = {};

    if (title) {
      filter.title = Like(`%${title}%`);
    }
    if (author) {
      filter.author = Like(`%${author}%`);
    }

    if (from_year && to_year) {
      filter.year = Between(from_year, to_year);
    }

    if (from_year && !!to_year === false) {
      filter.year = Between(from_year, from_year);
    }

    const result = await this.bookRepository.find({
      where: filter,
      skip: limit,
      take: pageSize,
    });

    return {
      message: 'Berhasil',
      status: '200',
      data: result,
      pagination: {
        total: total,
        page: page,
        pageSize: pageSize,
        totalPage: Math.ceil(total / pageSize),
      },
    };
  }

  async create(payload: CreateBookDto): Promise<ResponseSuccess> {
    try {
      const { title, author, year } = payload;

      const newBook = await this.bookRepository.save({
        title,
        author,
        year,
      });

      return {
        status: 'Success',
        message: 'Data Berhasil Ditambah',
        data: newBook,
      };
    } catch (error) {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async getDetail(id: number): Promise<ResponseSuccess> {
    const detailBook = await this.bookRepository.findOne({
      where: {
        id,
      },
    });

    if (detailBook === null) {
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    }

    return {
      status: 'Success',
      message: 'Detail Buku ditermukan',
      data: detailBook,
    };
  }

  async updateBook(
    id: number,
    updateBookDto: UpdateBookDto,
  ): Promise<ResponseSuccess> {
    const check = await this.bookRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);

    const update = await this.bookRepository.save({ ...updateBookDto, id: id });
    return {
      status: `Success `,
      message: 'Buku berhasil di update',
      data: update,
    };
  }

  async deleteBook(id: number): Promise<ResponseSuccess> {
    const check = await this.bookRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    await this.bookRepository.delete(id);
    return {
      status: `Success`,
      message: 'Berhasil menghapus buku',
    };
  }

  async bulkCreate(payload: CreateArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.data.map(async (data) => {
          try {
            await this.bookRepository.save(data);

            berhasil += 1;
          } catch {
            gagal += 1;
          }
        }),
      );

      return {
        status: 'Success',
        message: `Berhasil menyimpan ${berhasil} dan gagal ${gagal}`,
      };
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async bulkDelete(payload: DeleteArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.delete.map(async (data) => {
          try {
            const check = await this.bookRepository.findOne({
              where: {
                id: Number(data),
              },
            });

            if (!check) {
              gagal += 1;
            } else {
              await this.bookRepository.delete(data);
              berhasil += 1;
            }
          } catch {
            gagal += 1;
          }
        }),
      );

      return {
        status: 'Success',
        message: `Berhasil menghapus ${berhasil} dan gagal ${gagal}`,
      };
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }
}
