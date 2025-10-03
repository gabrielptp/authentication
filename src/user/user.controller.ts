import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UserService } from './user.service';
import { UserRegisterDto } from '../dto/user-register.dto';
import { UserVerifyDto } from '../dto/user-verify.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 registrations per minute
    async register(@Body() userRegisterDto: UserRegisterDto) {
        const result = await this.userService.register(userRegisterDto);
        return {
            success: true,
            data: result,
        };
    }

    @Post('verify')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 verification attempts per minute
    async verify(@Body() userVerifyDto: UserVerifyDto) {
        const { email, password } = userVerifyDto;
        const result = await this.userService.verifyUser(email, password);

        if (!result.isValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return {
            success: true,
            message: 'User verified successfully',
            data: {
                user: result.user,
            },
        };
    }
}
