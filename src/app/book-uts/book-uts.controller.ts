import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BookUtsService } from './book-uts.service';
import {
  BookUtsDto,
  FindBookUtsDto,
  UpdateBookUtsDeletedDto,
  UpdateBookUtsDto,
} from './bookuts.dto';
import { JwtGuard } from 'src/app/auth/auth.guard';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import { InjectUpdatedBy } from 'src/utils/decorator/inject-updated_by.decorator';
import { InjectDeleted } from 'src/utils/decorator/inject-delete.decorator';

@UseGuards(JwtGuard)
@Controller('book-uts')
export class BookUtsController {
  constructor(private bookService: BookUtsService) {}

  @Post('create')
  async create(@InjectCreatedBy() payload: BookUtsDto) {
    return this.bookService.create(payload);
  }

  @Get('list')
  async findAll(@Pagination() query: FindBookUtsDto) {
    return this.bookService.findAll(query);
  }

  @Put('update/:id')
  updateBook(
    @Param('id') id: string,
    @InjectUpdatedBy() updateProdukDto: UpdateBookUtsDto,
  ) {
    return this.bookService.updateBookUts(Number(id), updateProdukDto);
  }

  @Delete('delete/:id')
  deleteBook(
    @Param('id') id: string,
    @InjectDeleted() updateBookUtsDeletedDto: UpdateBookUtsDeletedDto,
  ) {
    return this.bookService.deleteBook(Number(id), updateBookUtsDeletedDto);
  }

  @Get('detail/:id')
  detail(@Param('id') id: string) {
    return this.bookService.getDetail(Number(id));
  }

  @Post('delete-back/:id')
  deleteBookBack(
    @Param('id') id: string,
    @InjectDeleted() updateBookUtsDeletedDto: UpdateBookUtsDeletedDto,
  ) {
    return this.bookService.deleteBookBack(Number(id), updateBookUtsDeletedDto);
  }
}
