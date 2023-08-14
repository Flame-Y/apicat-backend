import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @IsNotEmpty({ message: '用户名不能为空' })
    @ApiProperty()
    username: string;

    @IsNotEmpty({ message: '密码不能为空' })
    @ApiProperty({ minLength: 6, maxLength: 20 })
    password: string;
}
