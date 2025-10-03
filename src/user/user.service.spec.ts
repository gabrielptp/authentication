import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { UserService } from './user.service';
import { RedisService } from '../redis/redis.service';
import { UserRegisterDto } from '../dto/user-register.dto';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UserService', () => {
    let service: UserService;
    let redisService: jest.Mocked<RedisService>;

    beforeEach(async () => {
        const mockRedisService = {
            storeUser: jest.fn(),
            getUserByEmail: jest.fn(),
            getUserData: jest.fn(),
            userExists: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: RedisService,
                    useValue: mockRedisService,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        redisService = module.get(RedisService);
    });

    describe('Registration', () => {
        const validUserData: UserRegisterDto = {
            email: 'test@example.com',
            password: 'TestPass123!',
        };

        it('should register a new user successfully', async () => {
            // Arrange
            redisService.userExists.mockResolvedValue(false);
            redisService.storeUser.mockResolvedValue(undefined);
            mockedBcrypt.hash.mockResolvedValue('hashedPassword123' as never);

            // Act
            const result = await service.register(validUserData);

            // Assert
            expect(result).toEqual({
                message: 'User registered successfully',
                userId: expect.stringMatching(/^user_\d+_[a-z0-9]+$/),
            });

            expect(redisService.userExists).toHaveBeenCalledWith('test@example.com');
            expect(redisService.storeUser).toHaveBeenCalledWith(
                expect.stringMatching(/^user_\d+_[a-z0-9]+$/),
                'test@example.com',
                expect.objectContaining({
                    email: 'test@example.com',
                    password: 'hashedPassword123',
                    isActive: true,
                }),
            );
        });

        it('should throw ConflictException when email already exists', async () => {
            // Arrange
            redisService.userExists.mockResolvedValue(true);

            // Act & Assert
            await expect(service.register(validUserData)).rejects.toThrow(
                ConflictException,
            );
            await expect(service.register(validUserData)).rejects.toThrow(
                'Email is already registered',
            );

            expect(redisService.userExists).toHaveBeenCalledWith('test@example.com');
            expect(redisService.storeUser).not.toHaveBeenCalled();
        });

        it('should throw InternalServerErrorException when Redis operation fails', async () => {
            // Arrange
            redisService.userExists.mockResolvedValue(false);
            redisService.storeUser.mockRejectedValue(new Error('Redis connection failed'));
            mockedBcrypt.hash.mockResolvedValue('hashedPassword123' as never);

            // Act & Assert
            await expect(service.register(validUserData)).rejects.toThrow(
                InternalServerErrorException,
            );
            await expect(service.register(validUserData)).rejects.toThrow(
                'Failed to register user',
            );

            expect(redisService.userExists).toHaveBeenCalledWith('test@example.com');
            expect(redisService.storeUser).toHaveBeenCalled();
        });
    });

    describe('Verification', () => {
        const validCredentials = {
            email: 'test@example.com',
            password: 'TestPass123!',
        };

        const mockUser = {
            id: 'user_1234567890_abc123def',
            email: 'test@example.com',
            password: 'hashedPassword123',
            createdAt: '2024-01-01T12:00:00.000Z',
            isActive: true,
        };

        it('should verify valid credentials successfully', async () => {
            // Arrange
            redisService.getUserByEmail.mockResolvedValue('user_1234567890_abc123def');
            redisService.getUserData.mockResolvedValue(mockUser);
            mockedBcrypt.compare.mockResolvedValue(true as never);

            // Act
            const result = await service.verifyUser(validCredentials.email, validCredentials.password);

            // Assert
            expect(result).toEqual({
                isValid: true,
                user: {
                    id: 'user_1234567890_abc123def',
                    email: 'test@example.com',
                    createdAt: '2024-01-01T12:00:00.000Z',
                    isActive: true,
                },
            });

            expect(redisService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
            expect(redisService.getUserData).toHaveBeenCalledWith('user_1234567890_abc123def');
            expect(bcrypt.compare).toHaveBeenCalledWith('TestPass123!', 'hashedPassword123');
        });

        it('should return invalid for non-existent email', async () => {
            // Arrange
            redisService.getUserByEmail.mockResolvedValue(null);

            // Act
            const result = await service.verifyUser(validCredentials.email, validCredentials.password);

            // Assert
            expect(result).toEqual({
                isValid: false,
            });

            expect(redisService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
            expect(redisService.getUserData).not.toHaveBeenCalled();
        });

        it('should return invalid for wrong password', async () => {
            // Arrange
            redisService.getUserByEmail.mockResolvedValue('user_1234567890_abc123def');
            redisService.getUserData.mockResolvedValue(mockUser);
            mockedBcrypt.compare.mockResolvedValue(false as never);

            // Act
            const result = await service.verifyUser(validCredentials.email, 'WrongPassword123!');

            // Assert
            expect(result).toEqual({
                isValid: false,
            });

            expect(redisService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
            expect(redisService.getUserData).toHaveBeenCalledWith('user_1234567890_abc123def');
            expect(bcrypt.compare).toHaveBeenCalledWith('WrongPassword123!', 'hashedPassword123');
        });

        it('should handle Redis errors gracefully during verification', async () => {
            // Arrange
            redisService.getUserByEmail.mockRejectedValue(new Error('Redis connection failed'));

            // Act
            const result = await service.verifyUser(validCredentials.email, validCredentials.password);

            // Assert
            expect(result).toEqual({
                isValid: false,
            });

            expect(redisService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
        });
    });
});
