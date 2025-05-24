import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { RoleService } from './role/role.service';
import { POSTGRES_ERROR_CODES, RoleNameEnum } from 'src/utils/constants';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Inject the UserRepository
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>, // Inject the ProfileRepository
    private roleService: RoleService,
    private datasource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const queryRunner = await this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const role = await this.roleService.findOneByName(
        createUserDto.roleName || RoleNameEnum.USER,
      );
      const user = this.userRepository.create({
        ...CreateUserDto,
        role,
      });
      const createdUser = await queryRunner.manager.save(user);
      const profile = this.profileRepository.create({
        user,
      });
      await queryRunner.manager.save(profile);
      await queryRunner.commitTransaction();
      return createdUser;
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      if (error?.code == POSTGRES_ERROR_CODES.unique_violation) {
        throw new BadRequestException(error.detail);
      }
      throw new InternalServerErrorException(error.detail);
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all user`;
  }
  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
