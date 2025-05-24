import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';
import { RoleNameEnum } from 'src/utils/constants';

// DTO for creating a new user
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    { message: 'Please enter strong password' },
  )
  password: string;

  @IsEnum(RoleNameEnum)
  @IsOptional()
  roleName?: RoleNameEnum;
}
