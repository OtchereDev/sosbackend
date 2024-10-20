import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { RespondersModule } from 'src/responders/responders.module';

@Module({
  providers: [AuthService],
  imports: [UsersModule, RespondersModule],
  controllers: [AuthController],
})
export class AuthModule {}
