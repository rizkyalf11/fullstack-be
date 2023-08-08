import { Injectable } from '@nestjs/common';

export interface createBookDto {
  id?: number;
  title: string;
  author: string;
  year: number;
}

@Injectable()
export class BookService {
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

  getAllBooks(): {
    id?: number;
    title: string;
    author: string;
    year: number;
  }[] {
    return this.books;
  }

  create(payload: createBookDto): { status: string; message: string } {
    const { title, author, year } = payload;

    this.books.push({
      id: new Date().getTime(),
      title,
      author,
      year,
    });

    return {
      status: 'Success',
      message: 'Data Berhasil Ditambah',
    };
  }
}
