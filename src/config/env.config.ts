/* eslint-disable @typescript-eslint/no-unused-vars */
import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  // IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

export class EnvironmentVariables {
  @IsString()
  PROJECT: string = 'Cargle PM Tool';

  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  SECRET_KEY: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRATION_TIME: string;

  @IsString()
  MONGODB_URI: string;

  @IsString()
  REDIS_PORT: string;

  @IsString()
  REDIS_HOST: string;

  @IsString()
  CLIENT_URL: string;

  @IsString()
  BASE_URL: string;

  @IsNumber()
  CACHE_TTL: number;

  @IsString()
  CLOUDINARY_API_KEY: string;

  @IsString()
  CLOUDINARY_API_SECRET: string;

  @IsString()
  CLOUDINARY_NAME: string;

  // @IsString()
  // EMAIL_HOST: string;

  @IsString()
  EMAIL_USER: string;

  @IsString()
  EMAIL_PASSWORD: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
