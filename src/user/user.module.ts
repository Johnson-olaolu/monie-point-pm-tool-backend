import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { RoleModule } from './role/role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';

// Module for the user feature
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]), // Register User entity with TypeORM
    RoleModule, // Register User schema with Mongoose
  ],
  controllers: [UserController], // Register the controller
  providers: [UserService], // Register the service
})
export class UserModule {}
