import { Test, TestingModule } from '@nestjs/testing';
import { BookUtsService } from './book-uts.service';

describe('BookUtsService', () => {
  let service: BookUtsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookUtsService],
    }).compile();

    service = module.get<BookUtsService>(BookUtsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
