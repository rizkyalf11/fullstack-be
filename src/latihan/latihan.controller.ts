import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { LatihanService } from './latihan.service';

@Controller('latihan')
export class LatihanController {
  constructor(private latihanService: LatihanService) {}

  @Get()
  findAll(@Query() query: any) {
    return {
      query,
    };
  }

  @Post()
  create(@Body() payload: any) {
    return {
      payload,
    };
  }

  @Post('create')
  create2(@Body('name') name: string, @Body('sekolah') sekolah: string) {
    return {
      name,
      sekolah,
    };
  }

  @Put('update/:id/:nama')
  put(
    @Body() payload: any,
    @Param('id') id: string,
    @Param('nama') nama: string,
  ) {
    return {
      id: id,
      nama: nama,
      payload: payload,
    };
  }

  @Patch()
  patch() {
    return 'Latihan menggunakan method Patch';
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return {
      id,
    };
  }

  @Get('say-hello')
  sayHello() {
    return this.latihanService.sayHello();
  }
}
