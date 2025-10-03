import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
    }));

    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            disableErrorMessages: process.env.NODE_ENV === 'production',
        }),
    );

    const port = process.env.PORT || 3000;
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = process.env.REDIS_PORT || 6379;

    await app.listen(port);
    console.log(`- Authentication API running on port ${port}`);
    console.log(`- Redis connection: ${redisHost}:${redisPort}`);
    console.log(`- Security headers enabled`);
}
bootstrap();
