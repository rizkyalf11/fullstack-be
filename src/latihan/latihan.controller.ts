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

@Controller('latihan')
export class LatihanController {
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
}
