import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateApiResponseDto {
    @IsString()
    @IsNotEmpty({ message: '接口id不能为空' })
    @ApiProperty()
    aid: number;

    @IsNotEmpty({ message: '状态码不能为空' })
    @ApiProperty()
    HttpStatus: number;

    @IsNotEmpty({ message: '返回码不能为空' })
    @ApiProperty()
    code: number;

    @IsString()
    @IsNotEmpty({ message: '返回值不能为空' })
    @ApiProperty()
    data: string;

    @IsString()
    @ApiProperty()
    mock: string;

    @IsNotEmpty({ message: '项目id不能为空' })
    @ApiProperty()
    pid: number;
}
