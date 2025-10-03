import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Security headers (Helmet)
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
        crossOriginEmbedderPolicy: false, // Disable for API compatibility
    }));

    // Configure CORS
    app.enableCors({
        origin: configService.get<string[]>('cors.origins'),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        credentials: true,
        maxAge: 86400, // 24 hours
    });

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
