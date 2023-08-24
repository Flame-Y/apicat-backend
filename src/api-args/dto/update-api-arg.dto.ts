import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateApiArgDto {
    @IsString()
    @ApiProperty()
    @Length(1, 20)
    name: string;

    @IsString()
    @ApiProperty()
    argType: string;

    @IsString()
    @ApiProperty()
    form: string;

    @IsString()
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
