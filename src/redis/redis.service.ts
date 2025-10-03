import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private redis: Redis;
    
    // Redis key constants
    private readonly USER_PREFIX = 'user';
    private readonly EMAIL_INDEX_PREFIX = 'user:email';
    private readonly USERS_SET_KEY = 'users:all';

    constructor(private configService: ConfigService) {}

    async onModuleInit() {
        this.redis = new Redis({
            host: this.configService.get<string>('redis.host'),
            port: this.configService.get<number>('redis.port'),
            password: this.configService.get<string>('redis.password'),
            maxRetriesPerRequest: 3,
        });
    }

    async onModuleDestroy() {
        if (this.redis) {
            this.redis.disconnect();
        }
    }

    async storeUser(userId: string, email: string, userData: any): Promise<void> {
        const userKey = `${this.USER_PREFIX}:${userId}`;
        const pipeline = this.redis.pipeline();
        
        pipeline.hset(userKey, userData);
        pipeline.set(`${this.EMAIL_INDEX_PREFIX}:${email}`, userId);
        pipeline.sadd(this.USERS_SET_KEY, userId);
        
        await pipeline.exec();
    }

    async getUserByEmail(email: string): Promise<string | null> {
        return await this.redis.get(`${this.EMAIL_INDEX_PREFIX}:${email}`);
    }

    async getUserData(userId: string): Promise<any> {
        const userData = await this.redis.hgetall(`${this.USER_PREFIX}:${userId}`);
        if (!userData || Object.keys(userData).length === 0) {
            return null;
        }
        return userData;
    }

    async userExists(email: string): Promise<boolean> {
        const exists = await this.redis.exists(`${this.EMAIL_INDEX_PREFIX}:${email}`);
        return exists === 1;
    }
}
