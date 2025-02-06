import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import mongoose, { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Role } from './schemas/role.schema';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('RoleService', () => {
  let service: RoleService;
  let model: Model<Role>;

  const mockRoles = [
    { id: '1', name: 'Admin', description: 'Administrator role' },
    { id: '2', name: 'User', description: 'Regular user role' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getModelToken(Role.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
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

  describe('create', () => {
    it('should create a new role', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'admin',
        description: '',
      };

      jest.spyOn(model, 'create').mockResolvedValue(createRoleDto as any);

      const result = await service.create(createRoleDto);
      expect(model.create).toHaveBeenCalledWith(createRoleDto);
      expect(result).toEqual(createRoleDto);
    });

    it('should throw ConflictException if role with same name exists', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'admin',
        description: 'Administrator role',
      };
      const duplicateKeyError: Error & { code?: number } = new Error(
        'Duplicate key error',
      );
      duplicateKeyError.code = 11000;

      jest.spyOn(model, 'create').mockRejectedValue(duplicateKeyError);

      await expect(service.create(createRoleDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAllRoles', () => {
    it('should return an array of roles', async () => {
      jest.spyOn(model, 'find').mockResolvedValue(mockRoles as any);

      const result = await service.findAll();

      expect(result).toEqual(mockRoles);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('find Role by Id', () => {
    it('should return a role', async () => {
      const roleId = new mongoose.Types.ObjectId();
      jest.spyOn(model, 'findById').mockResolvedValue(mockRoles[0] as any);

      const result = await service.findOne(roleId.toString());
      expect(result).toEqual(mockRoles[0]);
      expect(model.findById).toHaveBeenCalledWith(roleId.toString());
    });
  });

  it('should throw not found error if role not found', async () => {
    const roleId = new mongoose.Types.ObjectId();
    jest.spyOn(model, 'findById').mockResolvedValue(undefined);
    await expect(service.findOne(roleId.toString())).rejects.toThrow(
      NotFoundException,
    );
  });

  describe('Find role by name', () => {
    it('should return a role', async () => {
      const name = 'admin';
      jest.spyOn(model, 'findOne').mockResolvedValue(mockRoles[0]);

      const result = await service.findOneByName(name);
      expect(result).toEqual(mockRoles[0]);
      expect(model.findOne).toHaveBeenCalledWith({ name });
    });
  });
});
