import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './User.model';

export type ForgotPasswordDocument = HydratedDocument<ForgotPassword>;

@Schema({
  timestamps: true,
})
export class ForgotPassword {
  @Prop()
  email: string;

  @Prop({ unique: true })
  resetToken: string;

  @Prop({ default: false })
  isUsed: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const ForgotPasswordSchema =
  SchemaFactory.createForClass(ForgotPassword);
