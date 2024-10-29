import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/models/User.model';
import * as mongoose from 'mongoose';
import { ChatMessage } from './message.model';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({
  timestamps: true,
})
export class Chat {
  @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
  user: User;

  @Prop({
    ref: 'ChatMessage',
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  })
  messages: ChatMessage[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
