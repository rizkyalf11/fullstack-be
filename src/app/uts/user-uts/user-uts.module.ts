import { Module } from '@nestjs/common';
import { UserUtsController } from './user-uts.controller';
import { UserUtsService } from './user-uts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserUts } from './useruts.enitity';

@Module({
  imports: [TypeOrmModule.forFeature([UserUts])],
  controllers: [UserUtsController],
  providers: [UserUtsService],
})
export class UserUtsModule {}
