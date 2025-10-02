import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors();

    const port = process.env.PORT || 3000;
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = process.env.REDIS_PORT || 6379;

    await app.listen(port);
    console.log(`🚀 Authentication API running on port ${port}`);
    console.log(`📡 Redis connection: ${redisHost}:${redisPort}`);
}
bootstrap();
