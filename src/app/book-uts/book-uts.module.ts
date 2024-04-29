import { Module } from '@nestjs/common';
import { BookUtsController } from './book-uts.controller';
import { BookUtsService } from './book-uts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookUts } from './book-uts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookUts])],
  controllers: [BookUtsController],
  providers: [BookUtsService],
})
export class BookUtsModule {}
