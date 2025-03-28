import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Fetch a user by ID
  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id); // Remove .exec() as it's not needed
    if (!user) throw new Error('User not found'); // Handle not found case
    return user; // Return the found user
  }

  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.userModel.create(createUserDto); // Create user in DB
    return newUser; // Return the created user
  }

  // Update an existing user by ID
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateUserDto },
      { new: true } // Return updated document
    ); // Remove .exec() as it's not needed
    if (!updatedUser) throw new Error('User not found'); // Handle not found case
    return updatedUser; // Return the updated user
  }

  // Delete a user by ID
  async delete(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id); // Remove .exec() as it's not needed
    if (!deletedUser) throw new Error('User not found'); // Handle not found case
    return deletedUser; // Return the deleted user
  }
}