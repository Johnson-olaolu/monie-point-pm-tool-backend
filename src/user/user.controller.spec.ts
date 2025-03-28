import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;

  // Mock the UserService with all CRUD methods
  const mockUserService = {
    create: jest.fn(), // Mock create method
    findById: jest.fn(), // Mock findById method
    update: jest.fn(), // Mock update method
    delete: jest.fn(), // Mock delete method
  };

  beforeEach(async () => {
    // Set up the testing module with the controller and mocked service
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  // Test for creating a user
  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
    };
    const mockUser = { _id: '12345', ...createUserDto };
    mockUserService.create.mockResolvedValue(mockUser); // Mock successful creation

    const result = await controller.create(createUserDto);
    expect(result).toEqual(mockUser); // Check returned user matches mock
    expect(mockUserService.create).toHaveBeenCalledWith(createUserDto); // Verify method call
  });

  // Test for getting a user by ID
  it('should return a user by ID', async () => {
    const userId = '12345';
    const mockUser = { _id: userId, name: 'Test User', email: 'test@example.com', password: 'password123', role: 'user' };
    mockUserService.findById.mockResolvedValue(mockUser); // Mock successful retrieval

    const result = await controller.findById(userId);
    expect(result).toEqual(mockUser); // Check returned user matches mock
    expect(mockUserService.findById).toHaveBeenCalledWith(userId); // Verify method call
  });

  // Test for updating a user
  it('should update a user', async () => {
    const userId = '12345';
    const updateUserDto: UpdateUserDto = { name: 'Updated User' }; // Only updating name (partial)
    const mockUpdatedUser = { _id: userId, name: 'Updated User', email: 'test@example.com', password: 'password123', role: 'user' };
    mockUserService.update.mockResolvedValue(mockUpdatedUser); // Mock successful update

    const result = await controller.update(userId, updateUserDto);
    expect(result).toEqual(mockUpdatedUser); // Check returned user matches mock
    expect(mockUserService.update).toHaveBeenCalledWith(userId, updateUserDto); // Verify method call
  });

  // Test for deleting a user
  it('should delete a user', async () => {
    const userId = '12345';
    const mockDeletedUser = { _id: userId, name: 'Test User', email: 'test@example.com', password: 'password123', role: 'user' };
    mockUserService.delete.mockResolvedValue(mockDeletedUser); // Mock successful deletion

    const result = await controller.delete(userId);
    expect(result).toEqual(mockDeletedUser); // Check returned user matches mock
    expect(mockUserService.delete).toHaveBeenCalledWith(userId); // Verify method call
  });
});