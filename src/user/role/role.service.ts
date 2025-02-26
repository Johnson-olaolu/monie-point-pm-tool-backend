import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const createdRole = new this.roleModel(createRoleDto);
    return createdRole.save();
  }

  async findAll(): Promise<RoleDocument[]> {
    return this.roleModel.find().exec();
  }

  async findOne(id: string): Promise<RoleDocument> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async findByName(name: string): Promise<RoleDocument> {
    const role = await this.roleModel.findOne({ name }).exec();
    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }
    return role;
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDocument> {
    const role = await this.findOne(id);
    for (const key in updateRoleDto) {
      role[key] = updateRoleDto[key];
    }
    return role.save();
  }

  async remove(id: string): Promise<RoleDocument> {
    const deletedRole = await this.roleModel.findByIdAndDelete(id).exec();
    if (!deletedRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return deletedRole;
  }
}
