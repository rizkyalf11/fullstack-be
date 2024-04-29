import { Test, TestingModule } from '@nestjs/testing';
import { UserUtsService } from './user-uts.service';

describe('UserUtsService', () => {
  let service: UserUtsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserUtsService],
    }).compile();

    service = module.get<UserUtsService>(UserUtsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
