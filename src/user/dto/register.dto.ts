import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 10)
    @Matches(/^[a-zA-Z0-9_-]+$/, {
        message: '用户名只能由字母、数字或 _、- 字符组成'
    })
    username: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 10)
    password: string;
}
