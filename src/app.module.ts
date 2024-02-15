import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module'; // AuthService 应该在这个模块中提供
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { ChatModule } from './chat/chat.module';
import { AIModule } from './ai/ai.module';
import { ConfigModule } from '@nestjs/config';
import { GlobalInterceptor } from './interceptor/global.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonLoggerService } from './interceptor/wiston-logger.service';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    //AuthModule, // 包含 AuthService
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'hwtest',
      entities: [User],
      charset: 'utf8mb4',
    }),
    ChatModule,
    AIModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useFactory: ( winston: WinstonLoggerService) => {
        return new GlobalInterceptor(winston);
      },
      inject: [WinstonLoggerService], // 这里列出GlobalInterceptor依赖的服务
    },
    WinstonLoggerService, // 提供 WinstonLoggerService
  ],
})
export class AppModule {}
