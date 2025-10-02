import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterDto } from '../dto/user-register.dto';
import { UserVerifyDto } from '../dto/user-verify.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() userRegisterDto: UserRegisterDto) {
        const result = await this.userService.register(userRegisterDto);
        return {
            success: true,
            data: result,
        };
    }

    @Post('verify')
    @HttpCode(HttpStatus.OK)
    async verify(@Body() userVerifyDto: UserVerifyDto) {
        const { username, password } = userVerifyDto;
        const result = await this.userService.verifyUser(username, password);

        if (!result.isValid) {
            throw new UnauthorizedException('Invalid username or password');
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
