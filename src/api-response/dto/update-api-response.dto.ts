import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateApiResponseDto {
    @IsString()
    @ApiProperty()
    aid: number;

    @ApiProperty()
    HttpStatus: number;

    @ApiProperty()
    code: number;

    @IsString()
    @ApiProperty()
    data: string;

    @IsString()
    @ApiProperty()
    mock: string;

    @IsNotEmpty({ message: '项目id不能为空' })
    @ApiProperty()
    pid: number;
}
