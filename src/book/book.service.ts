import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Repository } from 'typeorm';
import { ResponseSuccess } from 'src/interface/response';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {}

  private books: {
    id?: number;
    title: string;
    author: string;
    year: number;
  }[] = [
    {
      id: 1,
      title: 'HTML CSS',
      author: 'ihsanabuhanifah',
      year: 2023,
    },
  ];

  async getAllBooks(): Promise<ResponseSuccess> {
    const result = await this.bookRepository.find();
    return {
      message: 'Berhasil',
      status: '200',
      data: result,
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

  findBookById(id: number): number {
    const bookIndex = this.books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      throw new NotFoundException(`Buku dengan id ${id} tidak ditemukan`);
    }

    return bookIndex;
  }

  getDetail(id: number): CreateBookDto {
    const bookIndex = this.findBookById(id);
    const book = this.books[bookIndex];

    return book;
  }

  updateBook(
    id: number,
    title: string,
    author: string,
    year: number,
  ): {
    status: string;
    message: string;
  } {
    const bookIndex = this.books.findIndex((book) => book.id === id);
    this.books[bookIndex].title = title;
    this.books[bookIndex].author = author;
    this.books[bookIndex].year = year;

    return {
      status: 'Success',
      message: 'Berhasil update buku',
    };
  }

  deleteBook(id: number): {
    status: string;
    message: string;
  } {
    const bookIndex = this.findBookById(id);
    this.books.splice(bookIndex, 1);
    return {
      status: `Success ${bookIndex}`,
      message: 'Berhasil menghapus buku',
    };
  }
}
