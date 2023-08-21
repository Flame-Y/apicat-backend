import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateApiDto {
    @IsString()
    @IsNotEmpty({ message: '接口名不能为空' })
    @ApiProperty()
    @Length(1, 20)
    name: string;

    @IsString()
    @ApiProperty()
    description: string;

    @IsString()
    @IsNotEmpty({ message: '请求方式不能为空' })
    @ApiProperty()
    type: string;

    @IsString()
    @IsNotEmpty({ message: '接口地址不能为空' })
    @ApiProperty()
    url: string;

    @IsNotEmpty({ message: '项目id不能为空' })
    @ApiProperty()
    pid: number;
}
