import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';
import { tryCatch } from 'bullmq';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      const newRole = await this.roleModel.create(createRoleDto);
      return newRole;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException(
          `Role with name ${createRoleDto.name} already exists`,
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findAll() {
    return await this.roleModel.find();
  }

  async findOne(id: string) {
    const role = await this.roleModel.findById(id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async findOneByName(name: string) {
    const role = await this.roleModel.findOne({ name });
    return role;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
