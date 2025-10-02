import { IsString, IsNotEmpty } from 'class-validator';

export class UserVerifyDto {
    @IsNotEmpty({ message: 'Username is required' })
    username: string;

    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}
