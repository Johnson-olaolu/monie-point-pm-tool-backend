import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

// Controller for handling user-related HTTP requests
@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {} // Inject UserService

  // POST /users - Create a new user
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.UserService.create(createUserDto); // Call service to create user
  }

  // GET /users/:id - Get a user by ID
  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return this.UserService.findById(id); // Call service to get user
  }

  // PATCH /users/:id - Update a user by ID
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.UserService.update(id, updateUserDto); // Call service to update user
  }

  // DELETE /users/:id - Delete a user by ID
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<User> {
    return this.UserService.delete(id); // Call service to delete user
  }
}