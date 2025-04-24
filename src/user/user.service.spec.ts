import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;

  // Mock Mongoose model
  const mockUserModel = {
    findById: jest.fn(), // Mock for reading by ID
    create: jest.fn(), // Mock for creating
    findByIdAndUpdate: jest.fn(), // Mock for updating
    findByIdAndDelete: jest.fn(), // Mock for deleting
  };

  beforeEach(async () => {
    // Set up the testing module with mocked dependencies
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  // Test for creating a user
  it('should create and return a new user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'New User',
      email: 'new@example.com',
      password: 'password123',
      role: 'user',
    };
    const mockCreatedUser = { _id: '67890', ...createUserDto };
    mockUserModel.create.mockResolvedValue(mockCreatedUser); // Mock successful creation

    const result = await service.create(createUserDto);
    expect(result).toEqual(mockCreatedUser); // Check returned user matches mock
    expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto); // Verify method call
  });

  // Test for reading a user by ID
  it('should return a user by ID', async () => {
    const userId = '12345';
    const mockUser = {
      _id: userId,
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
    };
    mockUserModel.findById.mockResolvedValue(mockUser); // Mock successful find

    const result = await service.findById(userId);
    expect(result).toEqual(mockUser); // Check returned user matches mock
    expect(mockUserModel.findById).toHaveBeenCalledWith(userId); // Verify method call
  });

  // Test for when user is not found
  it('should throw an error if user is not found', async () => {
    const userId = '12345';
    mockUserModel.findById.mockResolvedValue(null); // Mock user not found

    await expect(service.findById(userId)).rejects.toThrow('User not found'); // Expect error
  });

  // Test for updating an existing user
  it('should update and return the modified user', async () => {
    const userId = '12345';
    const updateUserDto: UpdateUserDto = { name: 'Updated User' }; // Only updating name (partial)
    const mockUpdatedUser = {
      _id: userId,
      name: 'Updated User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
    };
    mockUserModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedUser); // Mock successful update

    const result = await service.update(userId, updateUserDto);
    expect(result).toEqual(mockUpdatedUser); // Check returned user matches mock
    expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
      userId,
      { $set: updateUserDto },
      { new: true }, // Return updated document
    ); // Verify method call with correct args
  });

  // Test for when user to update is not found
  it('should throw an error if user to update is not found', async () => {
    const userId = '12345';
    const updateUserDto: UpdateUserDto = { name: 'Updated User' };
    mockUserModel.findByIdAndUpdate.mockResolvedValue(null); // Mock user not found

    await expect(service.update(userId, updateUserDto)).rejects.toThrow(
      'User not found',
    );
  });

  // Test for deleting a user
  it('should delete a user and return the deleted user', async () => {
    const userId = '12345';
    const mockDeletedUser = {
      _id: userId,
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
    };
    mockUserModel.findByIdAndDelete.mockResolvedValue(mockDeletedUser); // Mock successful deletion

    const result = await service.delete(userId);
    expect(result).toEqual(mockDeletedUser); // Check returned user matches mock
    expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(userId); // Verify method call
  });

  // Test for when user to delete is not found
  it('should throw an error if user to delete is not found', async () => {
    const userId = '12345';
    mockUserModel.findByIdAndDelete.mockResolvedValue(null); // Mock user not found

    await expect(service.delete(userId)).rejects.toThrow('User not found');
  });
});
