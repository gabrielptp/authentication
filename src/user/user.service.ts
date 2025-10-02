import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Redis } from 'ioredis';
import * as bcrypt from 'bcryptjs';
import { UserRegisterDto } from '../dto/user-register.dto';

@Injectable()
export class UserService {
    private redis: Redis;

    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            maxRetriesPerRequest: 3,
        });
    }

    async register(userData: UserRegisterDto): Promise<{ message: string; userId: string }> {
        const { username, password } = userData;

        const usernameExists = await this.redis.exists(`user:username:${username}`);
        if (usernameExists) {
            throw new ConflictException('Username is already taken');
        }

        try {
            // Generate user ID
            const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Hash password
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Store user data in Redis
            const userKey = `user:${userId}`;
            const userDataToStore = {
                id: userId,
                username,
                password: hashedPassword,
                createdAt: new Date().toISOString(),
                isActive: true,
            };

            // Use Redis pipeline for atomic operations
            const pipeline = this.redis.pipeline();
            pipeline.hset(userKey, userDataToStore);
            pipeline.set(`user:username:${username}`, userId);
            pipeline.sadd('users:all', userId);
            await pipeline.exec();

            return {
                message: 'User registered successfully',
                userId,
            };
        } catch (error) {
            console.error('Registration error:', error);
            throw new InternalServerErrorException('Failed to register user');
        }
    }

    async findByUsername(username: string): Promise<any> {
        const userId = await this.redis.get(`user:username:${username}`);
        if (!userId) {
            return null;
        }
        return await this.findById(userId);
    }

    async findById(userId: string): Promise<any> {
        const userData = await this.redis.hgetall(`user:${userId}`);
        if (!userData || Object.keys(userData).length === 0) {
            return null;
        }
        return userData;
    }

    async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    async verifyUser(username: string, password: string): Promise<{ isValid: boolean; user?: any }> {
        try {
            const user = await this.findByUsername(username);
            
            if (!user) {
                return { isValid: false };
            }

            const isPasswordValid = await this.validatePassword(password, user.password);
            
            if (!isPasswordValid) {
                return { isValid: false };
            }

            // Return user data without password
            const { password: _, ...userWithoutPassword } = user;
            return {
                isValid: true,
                user: userWithoutPassword,
            };
        } catch (error) {
            console.error('User verification error:', error);
            return { isValid: false };
        }
    }

    onModuleDestroy() {
        this.redis.disconnect();
    }
}
