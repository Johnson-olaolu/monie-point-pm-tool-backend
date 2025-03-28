import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';

// Module for the user feature
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Register User schema with Mongoose
  ],
  controllers: [UserController], // Register the controller
  providers: [UserService], // Register the service
})
export class UsersModule {}