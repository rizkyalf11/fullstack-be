import { Body, Controller, Get, Post } from '@nestjs/common';
import { BookService, createBookDto } from './book.service';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('/list')
  findAllBook() {
    return this.bookService.getAllBooks();
  }

  @Post('/create')
  createBook(@Body() payload: createBookDto) {
    this.bookService.create(payload);
  }
}
