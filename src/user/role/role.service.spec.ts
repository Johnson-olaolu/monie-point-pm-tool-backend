import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './schema/role.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('RoleService', () => {
  let service: RoleService;
  let model: Model<Role>;

  const createRoleDto: CreateRoleDto = {
    name: 'Admin',
    description: 'Test Description',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getModelToken(Role.name),
          useValue: {
            create: jest.fn(),
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
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
    const mockRole = { ...createRoleDto };

    // jest.spyOn(model, 'create').mockResolvedValueOnce(mockRole as any);
    const mockSave = jest.fn().mockResolvedValue(mockRole);
    jest.spyOn(model, 'create').mockImplementationOnce(() => {
      return { save: mockSave };
    });

    const result = await service.create(createRoleDto);

    expect(result).toEqual(mockRole);
    expect(model.create).toHaveBeenCalledWith(createRoleDto);
  });
});
