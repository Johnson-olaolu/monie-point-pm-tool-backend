import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({
  timestamps: true,
})
export class Role {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.set('toJSON', {
  transform(doc, ret) {
    ret['id'] = ret['_id'];
    delete ret['_id'];
    delete ret['__v'];
    return ret;
  },
});
