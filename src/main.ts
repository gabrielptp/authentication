import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

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
            transformOptions: {
                enableImplicitConversion: true,
            },
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
