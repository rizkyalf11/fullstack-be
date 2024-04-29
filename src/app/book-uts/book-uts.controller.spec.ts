import { Test, TestingModule } from '@nestjs/testing';
import { BookUtsController } from './book-uts.controller';

describe('BookUtsController', () => {
  let controller: BookUtsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookUtsController],
    }).compile();

    controller = module.get<BookUtsController>(BookUtsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
