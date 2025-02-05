import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Role } from './schemas/role.schema';
import { MockModel } from 'src/database/test/mock.model';

describe('RoleService', () => {
  let service: RoleService;
  let model: Model<Role>;

  const mockRole = {
    name: 'admin',
    description: '',
  };

  class MockRole extends MockModel<Role> {
    protected entityStub: Role = mockRole;
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getModelToken(Role.name),
          useValue: MockRole,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    model = module.get<Model<Role>>(getModelToken(Role.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new role', async () => {
    const createRoleDto: CreateRoleDto = {
      name: 'admin',
      description: '',
    };

    const result = await service.create(createRoleDto);
    expect(result).toEqual(mockRole);
  });
});
