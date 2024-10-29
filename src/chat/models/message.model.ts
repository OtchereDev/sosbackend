import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/models/User.model';
import * as mongoose from 'mongoose';

export type ChatDocument = HydratedDocument<ChatMessage>;

export enum ChatUser {
  System = 'system',
  Assistant = 'assistant',
  Human = 'human',
}

@Schema({
  timestamps: true,
})
export class ChatMessage {
  @Prop({ ref: 'User', type: mongoose.Schema.Types.ObjectId })
  user: User;

  @Prop()
  content: string;

  @Prop({ enum: ChatUser })
  role: string;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
