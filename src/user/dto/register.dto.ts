import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterDto {
    @IsEmail()
    @IsNotEmpty({ message: '邮箱不能为空' })
    @ApiProperty()
    @Length(1, 100)
    email: string;

    @IsString()
    @IsNotEmpty({ message: '用户名不能为空' })
    @ApiProperty()
    @Length(1, 10)
    @Matches(/^[a-zA-Z0-9_-]+$/, {
        message: '用户名只能由字母、数字或 _、- 字符组成'
    })
    username: string;

    @IsString()
    @IsNotEmpty({ message: '密码不能为空' })
    @Length(6, 20)
    @ApiProperty({ minLength: 6, maxLength: 20 })
    password: string;

    @IsString()
    githubId: string;

    @IsString()
    avatar: string;
}
