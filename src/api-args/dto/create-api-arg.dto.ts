import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateApiArgDto {
    @IsString()
    @IsNotEmpty({ message: '接口id不能为空' })
    @ApiProperty()
    aid: number;

    @IsString()
    @IsNotEmpty({ message: '参数名不能为空' })
    @ApiProperty()
    @Length(1, 20)
    name: string;

    @IsString()
    @IsNotEmpty({ message: '参数字段类型不能为空' })
    @ApiProperty()
    argType: string;

    @IsString()
    @IsNotEmpty({ message: '参数格式不能为空' })
    @ApiProperty()
    form: string;

    @IsString()
    @IsNotEmpty({ message: '参数类型不能为空' })
    @ApiProperty()
    dataType: string;

    @IsString()
    @ApiProperty()
    default: string;

    @IsString()
    @ApiProperty()
    required: boolean;

    @IsString()
    @ApiProperty()
    description: string;

    @IsNotEmpty({ message: '项目id不能为空' })
    @ApiProperty()
    pid: number;
}
