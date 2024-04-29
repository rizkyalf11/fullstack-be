import { Test, TestingModule } from '@nestjs/testing';
import { UserUtsController } from './user-uts.controller';

describe('UserUtsController', () => {
  let controller: UserUtsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserUtsController],
    }).compile();

    controller = module.get<UserUtsController>(UserUtsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
