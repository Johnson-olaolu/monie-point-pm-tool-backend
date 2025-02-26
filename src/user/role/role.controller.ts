import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const data = await this.roleService.create(createRoleDto);
    return {
      success: true,
      message: 'Role created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.roleService.findAll();
    return {
      success: true,
      message: 'Roles retrieved successfully',
      data,
    };
  }

  @Get('name')
  async findByName(@Query('name') name: string) {
    const data = await this.roleService.findByName(name);
    return {
      success: true,
      message: 'Role retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.roleService.findOne(id);
    return {
      success: true,
      message: 'Role retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const data = await this.roleService.update(id, updateRoleDto);
    return {
      success: true,
      message: 'Role updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.roleService.remove(id);
    return {
      success: true,
      message: 'Role deleted successfully',
      data,
    };
  }
}
