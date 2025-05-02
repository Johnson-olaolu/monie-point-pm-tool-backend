import { Repository } from 'typeorm';
import { RoleService } from './role.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from './entities/role.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto/create-role.dto';

describe('RoleService', () => {
  let service: RoleService;
  let roleRepository: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(Role),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    roleRepository = module.get(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new role', async () => {
    const createRoleDto: CreateRoleDto = {
      name: 'Admin',
      description: 'Administrator role',
    };
    const role = { id: '1234567', ...createRoleDto } as Role;

    jest.spyOn(roleRepository, 'create').mockReturnValue(role);
    jest.spyOn(roleRepository, 'save').mockReturnValue(Promise.resolve(role));

    const result = await service.create(createRoleDto);

    expect(result).toEqual(role);
    expect(roleRepository.save).toHaveBeenCalledWith(role);
  });

  it('should find all roles', async () => {
    const roles = [
      { id: '1234567', name: 'Admin', description: 'This is an admin' },
    ] as Role[];

    jest.spyOn(roleRepository, 'find').mockReturnValue(Promise.resolve(roles));

    const result = await service.findAll();

    expect(result).toEqual(roles);
    expect(roleRepository.find).toHaveBeenCalled();
  });

  it('should find a role by ID', async () => {
    const role = {
      id: '1234567',
      name: 'Admin',
      description: 'This is an admin',
    } as Role;

    jest
      .spyOn(roleRepository, 'findOneBy')
      .mockReturnValue(Promise.resolve(role));

    const result = await service.findOneById('1234567');

    expect(result).toEqual(role);
    expect(roleRepository.findOneBy).toHaveBeenCalledWith({ id: '1234567' });
  });

  it('should find a role by name', async () => {
    const role = {
      id: '1234567',
      name: 'Admin',
      description: 'This is an admin',
    } as Role;
    jest
      .spyOn(roleRepository, 'findOneBy')
      .mockReturnValue(Promise.resolve(role));
    const result = await service.findOneByName('Admin');
    expect(result).toEqual(role);
    expect(roleRepository.findOneBy).toHaveBeenCalledWith({ name: 'Admin' });
  });

  it('should update a role', async () => {
    const id = '1234567';
    const role = {
      id: '1234567',
      name: 'Admin',
      description: 'This is an admin',
    } as Role;
    const updateRoleDto = { name: 'User', description: 'This is a user' };
    jest
      .spyOn(roleRepository, 'update')
      .mockReturnValue(Promise.resolve({ ...role, ...updateRoleDto } as any));
    await service.update(id, updateRoleDto);
    expect(roleRepository.update).toHaveBeenCalledWith({ id }, updateRoleDto);
  });

  it('should delete a role', async () => {
    const id = '1234567';
    jest
      .spyOn(roleRepository, 'delete')
      .mockReturnValue(Promise.resolve({} as any));

    await service.remove(id);

    expect(roleRepository.softDelete).toHaveBeenCalledWith({ id });
  });
});
