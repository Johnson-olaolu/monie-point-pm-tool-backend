import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { getModelToken } from '@nestjs/mongoose';
import { Role } from './schemas/role.schema';
// import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('RoleService', () => {
  let service: RoleService;

  const mockRole = {
    id: 'some-id',
    name: 'admin',
    description: 'Administrator role',
  };

  const mockRoleModel = {
    new: jest.fn().mockReturnValue({
      ...mockRole,
      save: jest.fn().mockResolvedValue(mockRole),
    }),
    constructor: jest.fn().mockResolvedValue(mockRole),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
  };

  function MockModel(dto) {
    return {
      ...dto,
      save: jest.fn().mockResolvedValue(mockRole),
    };
  }

  Object.assign(MockModel, mockRoleModel);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getModelToken(Role.name),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByName', () => {
    it('should return a role by name', async () => {
      jest.spyOn(mockRoleModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockRole),
      } as any);

      const result = await service.findByName('admin');
      expect(result).toEqual(mockRole);
    });

    it('should throw NotFoundException when role is not found', async () => {
      jest.spyOn(mockRoleModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.findByName('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a role by id', async () => {
      jest.spyOn(mockRoleModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockRole),
      } as any);

      const result = await service.findOne('some-id');
      expect(result).toEqual(mockRole);
    });

    it('should throw NotFoundException when role is not found', async () => {
      jest.spyOn(mockRoleModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new role', async () => {
      const createRoleDto = {
        name: 'admin',
        description: 'Administrator role',
      };

      const result = await service.create(createRoleDto);
      expect(result).toEqual(mockRole);
    });
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const mockRoles = [mockRole, { ...mockRole, id: 'other-id' }];

      jest.spyOn(mockRoleModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRoles),
      } as any);

      const result = await service.findAll();
      expect(result).toEqual(mockRoles);
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const updateRoleDto = {
        description: 'Updated description',
      };

      const mockUpdatedRole = {
        ...mockRole,
        description: updateRoleDto.description,
        save: jest.fn().mockResolvedValue({
          ...mockRole,
          description: updateRoleDto.description,
        }),
      };

      jest.spyOn(mockRoleModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUpdatedRole),
      } as any);

      const result = await service.update('some-id', updateRoleDto);
      expect(result.description).toEqual(updateRoleDto.description);
      expect(mockUpdatedRole.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when updating non-existent role', async () => {
      const updateRoleDto = {
        description: 'Updated description',
      };

      jest.spyOn(mockRoleModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        service.update('non-existent-id', updateRoleDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a role', async () => {
      jest.spyOn(mockRoleModel, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRole),
      } as any);

      const result = await service.remove('some-id');
      expect(result).toEqual(mockRole);
      expect(mockRoleModel.findByIdAndDelete).toHaveBeenCalledWith('some-id');
    });

    it('should throw NotFoundException when removing non-existent role', async () => {
      jest.spyOn(mockRoleModel, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // Add more test cases for other methods as needed
});
