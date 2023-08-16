import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LatihanModule } from './latihan/latihan.module';
import { BookModule } from './book/book.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [LatihanModule, BookModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
