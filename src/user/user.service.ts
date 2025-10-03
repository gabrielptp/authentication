import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcryptjs';
import { UserRegisterDto } from '../dto/user-register.dto';

@Injectable()
export class UserService {
    constructor(private redisService: RedisService) {}

    async register(userData: UserRegisterDto): Promise<{ message: string; userId: string }> {
        const { email, password } = userData;

        await this.validateEmailNotExists(email);

        try {
            const userId = this.generateUserId();
            const hashedPassword = await this.hashPassword(password);
            const userDataToStore = this.createUserData(userId, email, hashedPassword);
            
            await this.redisService.storeUser(userId, email, userDataToStore);

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
        const userId = await this.redisService.getUserByEmail(email);
        if (!userId) {
            return null;
        }
        return await this.findById(userId);
    }

    async findById(userId: string): Promise<any> {
        return await this.redisService.getUserData(userId);
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
        const emailExists = await this.redisService.userExists(email);
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


    private removePasswordFromUser(user: any): any {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

}
