import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import {
  CreateArrayDto,
  CreateBookDto,
  DeleteArrayDto,
  FindBookDto,
  UpdateBookDto,
} from './book.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get('/list')
  findAllBook(@Pagination() findBookDto: FindBookDto) {
    return this.bookService.getAllBooks(findBookDto);
  }

  @Post('/create')
  createBook(@Body() payload: CreateBookDto) {
    return this.bookService.create(payload);
  }

  @Get('detail/:id')
  findOneBook(@Param('id') id: string) {
    return this.bookService.getDetail(Number(id));
  }

  @Put('update/:id')
  updateBook(@Param('id') id: string, @Body() payload: UpdateBookDto) {
    return this.bookService.updateBook(Number(id), payload);
  }

  @Delete('delete/:id')
  deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(+id);
  }

  @Post('/create/bulk')
  bulkCreateBook(@Body() payload: CreateArrayDto) {
    return this.bookService.bulkCreate(payload);
  }

  @Post('/delete/bulk')
  bulkDeleteBook(@Body() payload: DeleteArrayDto) {
    console.log(payload);
    return this.bookService.bulkDelete(payload);
  }
}
