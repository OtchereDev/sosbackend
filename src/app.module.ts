import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { EmergencyModule } from './emergency/emergency.module';
import { RespondersModule } from './responders/responders.module';
import { FirebaseModule } from './firebase/firebase.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AgoraModule } from './agora/agora.module';
import { GuideModule } from './guide/guide.module';
import { AiModule } from './ai/ai.module';
import { EmbeddingModule } from './embedding/embedding.module';
import { ChatModule } from './chat/chat.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { QuizModule } from './quiz/quiz.module';
import { PubliAnnouncementModule } from './publi-announcement/publi-announcement.module';
import { TutorialsModule } from './tutorials/tutorials.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    EmergencyModule,
    RespondersModule,
    FirebaseModule,
    ScheduleModule.forRoot(),
    AgoraModule,
    GuideModule,
    AiModule,
    EmbeddingModule,
    ChatModule,
    DashboardModule,
    QuizModule,
    PubliAnnouncementModule,
    TutorialsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
