import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Security headers (Helmet)
    app.use(helmet());

    // Enable CORS
    app.enableCors();

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            disableErrorMessages: configService.get<string>('nodeEnv') === 'production',
        }),
    );

    const port = configService.get<number>('port');
    const redisHost = configService.get<string>('redis.host');
    const redisPort = configService.get<number>('redis.port');
    const nodeEnv = configService.get<string>('nodeEnv');

    await app.listen(port);
    console.log(`- Authentication API running on port ${port}`);
    console.log(`- Environment: ${nodeEnv}`);
    console.log(`- Redis connection: ${redisHost}:${redisPort}`);
    console.log(`- Security headers enabled`);
}
bootstrap();
