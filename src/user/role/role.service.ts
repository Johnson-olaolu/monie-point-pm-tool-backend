import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>, // Inject the RoleRepository
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto); // Create a new role instance
    return await this.roleRepository.save(role); // Save the role to the database
  }

  async findAll() {
    const roles = await this.roleRepository.find(); // Find all roles
    return roles;
  }

  async findOneById(id: string) {
    const role = await this.roleRepository.findOneBy({ id }); // Find a role by ID
    return role;
  }

  async findOneByName(name: string) {
    const role = await this.roleRepository.findOneBy({ name }); // Find a role by name
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const updatedRole = await this.roleRepository.update(
      { id },
      { ...updateRoleDto },
    ); // Create an updated role instance
    return updatedRole; // Save the updated role to the database
  }

  async remove(id: string) {
    return await this.roleRepository.softDelete({ id }); // Delete a role by ID
  }
}
