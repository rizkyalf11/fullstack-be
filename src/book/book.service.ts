import { Injectable } from '@nestjs/common';

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
}
