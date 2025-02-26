import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

describe('RoleController', () => {
  let controller: RoleController;
  let service: RoleService;

  const mockRole = {
    id: 'some-id',
    name: 'admin',
    description: 'Administrator role',
  };

  const mockRoleService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByName: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: mockRoleService,
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a role', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'admin',
        description: 'Administrator role',
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockRole);

      const result = await controller.create(createRoleDto);
      expect(result).toEqual({
        success: true,
        message: 'Role created successfully',
        data: mockRole,
      });
      expect(service.create).toHaveBeenCalledWith(createRoleDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const mockRoles = [mockRole, { ...mockRole, id: 'other-id' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockRoles as any);

      const result = await controller.findAll();
      expect(result).toEqual({
        success: true,
        message: 'Roles retrieved successfully',
        data: mockRoles,
      });
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findByName', () => {
    it('should return a role by name', async () => {
      jest.spyOn(service, 'findByName').mockResolvedValue(mockRole as any);

      const result = await controller.findByName('admin');
      expect(result).toEqual({
        success: true,
        message: 'Role retrieved successfully',
        data: mockRole,
      });
      expect(service.findByName).toHaveBeenCalledWith('admin');
    });
  });

  describe('findOne', () => {
    it('should return a role by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockRole as any);

      const result = await controller.findOne('some-id');
      expect(result).toEqual({
        success: true,
        message: 'Role retrieved successfully',
        data: mockRole,
      });
      expect(service.findOne).toHaveBeenCalledWith('some-id');
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const updateRoleDto: UpdateRoleDto = {
        description: 'Updated description',
      };

      const updatedRole = { ...mockRole, ...updateRoleDto };
      jest.spyOn(service, 'update').mockResolvedValue(updatedRole as any);

      const result = await controller.update('some-id', updateRoleDto);
      expect(result).toEqual({
        success: true,
        message: 'Role updated successfully',
        data: updatedRole,
      });
      expect(service.update).toHaveBeenCalledWith('some-id', updateRoleDto);
    });
  });

  describe('remove', () => {
    it('should remove a role', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(mockRole as any);

      const result = await controller.remove('some-id');
      expect(result).toEqual({
        success: true,
        message: 'Role deleted successfully',
        data: mockRole,
      });
      expect(service.remove).toHaveBeenCalledWith('some-id');
    });
  });
});
