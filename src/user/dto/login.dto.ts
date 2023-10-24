import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @IsEmail()
    @IsNotEmpty({ message: '邮箱不能为空' })
    @ApiProperty()
    email: string;

    @IsNotEmpty({ message: '密码不能为空' })
    @ApiProperty({ minLength: 6, maxLength: 20 })
    password: string;
}
