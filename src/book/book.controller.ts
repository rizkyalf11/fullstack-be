import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
    return this.bookService.create(payload);
  }

  @Get('detail/:id')
  findOneBook(@Param('id') id: string) {
    return this.bookService.getDetail(Number(id));
  }
}
