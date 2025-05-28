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
  @IsNotEmpty()
  DB_HOST: string;

  // @IsNumber()
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_USER: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DB_DATABASE: string;

  @IsString()
  @IsOptional()
  POSTGRES_CERT: string;

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

  @IsString()
  RESEND_API_KEY: string;

  @IsString()
  FIREBASE_PROJECT_ID: string;

  @IsString()
  FIREBASE_PRIVATE_KEY: string;

  @IsString()
  FIREBASE_CLIENT_EMAIL: string;

  @IsString()
  FIREBASE_DATABSE_URL: string;

  @IsString()
  META_BASE_URL: string;

  @IsString()
  META_ACCESS_TOKEN: string;

  @IsString()
  META_PHONE_NUMBER_ID: string;
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
