import { Test, TestingModule } from '@nestjs/testing';
import { InAppService } from './in-app.service';

describe('AppService', () => {
  let service: InAppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InAppService],
    }).compile();

    service = module.get<InAppService>(InAppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
