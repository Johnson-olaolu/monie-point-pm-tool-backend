import { IsString, IsEmail, MinLength } from 'class-validator';

// DTO for creating a new user
export class CreateUserDto {
  @IsString() // Ensure name is a string
  name: string;

  @IsEmail() // Ensure email is a valid email format
  email: string;

  @IsString() // Ensure password is a string
  @MinLength(6) // Password must be at least 6 characters
  password: string;

  @IsString() // Ensure role is a string (optional, defaults in schema)
  role?: string;
}