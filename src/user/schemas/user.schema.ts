import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Type alias for TypeScript to combine User with Mongoose Document
export type UserDocument = User & Document;

// Define the User schema with Mongoose
@Schema({ timestamps: true }) // Add createdAt and updatedAt fields automatically
export class User {
  @Prop({ required: true }) // Name is a required field
  name: string;

  @Prop({ required: true, unique: true }) // Email is required and must be unique
  email: string;

  @Prop({ required: true }) // Password is required (you might hash this later)
  password: string;

  @Prop({ default: 'user' }) // Default role for a user
  role: string;
}

// Create the Mongoose schema from the User class
export const UserSchema = SchemaFactory.createForClass(User);