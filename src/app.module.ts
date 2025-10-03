import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import envConfig from './config/env.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [envConfig],
            envFilePath: [
                `.env.${process.env.NODE_ENV || 'development'}`,
                '.env',
            ],
        }),
        ThrottlerModule.forRoot([{
            ttl: 60000, // 1 minute
            limit: 10,  // 10 requests per minute (default)
        }]),
        UserModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
