import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import * as bcrypt from 'bcryptjs';
import { UserRegisterDto } from '../dto/user-register.dto';

@Injectable()
export class UserService {
    private redis: Redis;
    
    // Redis key constants
    private readonly USER_PREFIX = 'user';
    private readonly EMAIL_INDEX_PREFIX = 'user:email';
    private readonly USERS_SET_KEY = 'users:all';

    constructor(private configService: ConfigService) {
        this.redis = new Redis({
            host: this.configService.get<string>('redis.host'),
            port: this.configService.get<number>('redis.port'),
            password: this.configService.get<string>('redis.password'),
            maxRetriesPerRequest: 3,
        });
    }

    async register(userData: UserRegisterDto): Promise<{ message: string; userId: string }> {
        const { email, password } = userData;

        await this.validateEmailNotExists(email);

        try {
            const userId = this.generateUserId();
            const hashedPassword = await this.hashPassword(password);
            const userDataToStore = this.createUserData(userId, email, hashedPassword);
            
            await this.storeUserData(userId, email, userDataToStore);

            return {
                message: 'User registered successfully',
                userId,
            };
        } catch (error) {
            console.error('Registration error:', error);
            throw new InternalServerErrorException('Failed to register user');
        }
    }

    async findByEmail(email: string): Promise<any> {
        const userId = await this.redis.get(`${this.EMAIL_INDEX_PREFIX}:${email}`);
        if (!userId) {
            return null;
        }
        return await this.findById(userId);
    }

    async findById(userId: string): Promise<any> {
        const userData = await this.redis.hgetall(`${this.USER_PREFIX}:${userId}`);
        if (!userData || Object.keys(userData).length === 0) {
            return null;
        }
        return userData;
    }

    async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    async verifyUser(email: string, password: string): Promise<{ isValid: boolean; user?: any }> {
        try {
            const user = await this.findByEmail(email);
            
            if (!user) {
                return { isValid: false };
            }

            const isPasswordValid = await this.validatePassword(password, user.password);
            
            if (!isPasswordValid) {
                return { isValid: false };
            }

            const userWithoutPassword = this.removePasswordFromUser(user);
            return {
                isValid: true,
                user: userWithoutPassword,
            };
        } catch (error) {
            console.error('User verification error:', error);
            return { isValid: false };
        }
    }

    private async validateEmailNotExists(email: string): Promise<void> {
        const emailExists = await this.redis.exists(`${this.EMAIL_INDEX_PREFIX}:${email}`);
        if (emailExists) {
            throw new ConflictException('Email is already registered');
        }
    }

    private generateUserId(): string {
        return `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }

    private createUserData(userId: string, email: string, hashedPassword: string) {
        return {
            id: userId,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            isActive: true,
        };
    }

    private async storeUserData(userId: string, email: string, userDataToStore: any): Promise<void> {
        const userKey = `${this.USER_PREFIX}:${userId}`;
        const pipeline = this.redis.pipeline();
        
        pipeline.hset(userKey, userDataToStore);
        pipeline.set(`${this.EMAIL_INDEX_PREFIX}:${email}`, userId);
        pipeline.sadd(this.USERS_SET_KEY, userId);
        
        await pipeline.exec();
    }

    private removePasswordFromUser(user: any): any {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    onModuleDestroy() {
        this.redis.disconnect();
    }
}
