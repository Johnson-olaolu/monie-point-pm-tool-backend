import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleNameEnum } from 'src/utils/constants';
import { RoleService } from './role/role.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EmptyLogger } from 'src/utils/empty-logger';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let profileRepository: Repository<Profile>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let roleService: RoleService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let dataSource: DataSource;

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      create: jest.fn(),
      save: jest.fn(),
    },
  } as unknown as QueryRunner;

  const mockDataSource = {
    createQueryRunner: jest.fn(() => mockQueryRunner),
  } as unknown as DataSource;

  beforeEach(async () => {
    // Set up the testing module with mocked dependencies
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Profile),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: RoleService,
          useValue: {
            findOneByName: jest.fn(),
          },
        },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();
    module.useLogger(new EmptyLogger());

    service = module.get<UserService>(UserService);
    roleService = module.get<RoleService>(RoleService);
    userRepository = module.get(getRepositoryToken(User));
    profileRepository = module.get(getRepositoryToken(Profile));
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'superAdmin@pmtool.com',
      name: 'Super Admin',
      password: 'Admin_123',
      roleName: RoleNameEnum.USER,
    };

    const user = {
      ...createUserDto,
      id: '123456',
    } as User;

    const profile = { user } as Profile;

    jest.spyOn(userRepository, 'create').mockReturnValue(user);
    jest.spyOn(userRepository, 'save').mockReturnValue(Promise.resolve(user));
    jest.spyOn(profileRepository, 'create').mockReturnValue(profile);
    jest
      .spyOn(profileRepository, 'save')
      .mockReturnValue(Promise.resolve(profile));

    jest
      .spyOn(mockQueryRunner.manager, 'create')
      .mockImplementationOnce(() => user as any)
      .mockImplementationOnce(() => profile as any);

    jest
      .spyOn(mockQueryRunner.manager, 'save')
      .mockImplementationOnce(async () => user)
      .mockImplementationOnce(async () => profile);

    const result = await service.create(createUserDto);

    expect(mockDataSource.createQueryRunner).toHaveBeenCalled();
    expect(mockQueryRunner.connect).toHaveBeenCalled();
    expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
    expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(user);
    expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(profile);
    expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    expect(mockQueryRunner.release).toHaveBeenCalled();
    expect(result).toEqual(user);
  });

  it('should rollback transaction on error', async () => {
    const createUserDto: CreateUserDto = {
      email: 'superAdmin@pmtool.com',
      name: 'Super Admin',
      password: 'Admin_123',
      roleName: RoleNameEnum.USER,
    };

    const user = {
      ...createUserDto,
      id: '123456',
    } as User;

    jest
      .spyOn(mockQueryRunner.manager, 'create')
      .mockImplementationOnce(() => user as any);
    jest
      .spyOn(mockQueryRunner.manager, 'save')
      .mockImplementationOnce(async () => {
        throw new Error('Save failed');
      });

    await expect(service.create(createUserDto)).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(mockQueryRunner.release).toHaveBeenCalled();
  });

  it('should throw BadRequestException if email already exists', async () => {
    const createUserDto: CreateUserDto = {
      email: 'superAdmin@pmtool.com',
      name: 'Super Admin',
      password: 'Admin_123',
      roleName: RoleNameEnum.USER,
    };
    const duplicateKeyError = {
      code: '23505',
      detail: 'Key (email)=(test@example.com) already exists.',
    };
    const user = {
      ...createUserDto,
      id: '123456',
    } as User;

    jest
      .spyOn(mockQueryRunner.manager, 'create')
      .mockImplementationOnce(() => user as any);
    jest
      .spyOn(mockQueryRunner.manager, 'save')
      .mockRejectedValue(duplicateKeyError);

    await expect(service.create(createUserDto)).rejects.toThrow(
      BadRequestException,
    );
    await expect(service.create(createUserDto)).rejects.toThrow(
      duplicateKeyError.detail,
    );
  });
});
