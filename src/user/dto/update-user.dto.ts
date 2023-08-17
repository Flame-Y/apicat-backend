import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
    avatar: string;

    @IsNotEmpty({
        message: '用户名不能为空'
    })
    username: string;
}
